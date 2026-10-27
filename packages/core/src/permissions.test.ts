import { describe, it, expect } from 'vitest';
import { can, type Actor, type Role, type Action, type Resource } from './permissions';

const A = 'school-a', B = 'school-b';
const actor = (roles: Role[], schoolId: string | null = A): Actor => ({ id: 'u1', roles, schoolId });
const res = (o: Partial<Resource> = {}): Resource => ({ schoolId: A, ...o });
const flags = (o = {}) => ({ canPay: false, canViewResults: false, canMessage: false, mayCollect: false, ...o });

describe('tenant isolation', () => {
  const all: Action[] = ['content.read', 'progress.read', 'notice.send', 'fees.read', 'results.read', 'message.audit', 'audit.read', 'class.manage'];
  const roles: Role[] = ['student', 'guardian', 'teacher', 'school_admin', 'content_editor', 'bursar', 'head_teacher', 'platform_admin'];
  for (const r of roles) for (const a of all) {
    it(`${r} cannot ${a} in another school`, () => {
      expect(can(actor([r]), a, res({ schoolId: B, childId: 'c', guardianFlags: flags({ canPay: true, canViewResults: true, canMessage: true }), actorTeachesClass: true, isSelf: true }))).toBe(false);
    });
  }
});

describe('platform admin', () => {
  it('can verify schools', () => expect(can(actor(['platform_admin'], null), 'school.verify', res({ schoolId: B }))).toBe(true));
  it('cannot read fees, results or messages', () => {
    for (const a of ['fees.read', 'results.read', 'message.audit'] as Action[]) expect(can(actor(['platform_admin'], null), a, res())).toBe(false);
  });
  it('school admin cannot verify schools', () => expect(can(actor(['school_admin']), 'school.verify', res())).toBe(false));
});

describe('guardian flags', () => {
  it('needs canPay to see fees and pay', () => {
    expect(can(actor(['guardian']), 'fees.read', res({ childId: 'c', guardianFlags: flags() }))).toBe(false);
    expect(can(actor(['guardian']), 'payment.make', res({ childId: 'c', guardianFlags: flags() }))).toBe(false);
    expect(can(actor(['guardian']), 'fees.read', res({ childId: 'c', guardianFlags: flags({ canPay: true }) }))).toBe(true);
  });
  it('needs canViewResults for results', () => {
    expect(can(actor(['guardian']), 'results.read', res({ childId: 'c', guardianFlags: flags() }))).toBe(false);
    expect(can(actor(['guardian']), 'results.read', res({ childId: 'c', guardianFlags: flags({ canViewResults: true }) }))).toBe(true);
  });
  it('needs canMessage to message', () => {
    expect(can(actor(['guardian']), 'message.send', res({ childId: 'c', guardianFlags: flags() }))).toBe(false);
    expect(can(actor(['guardian']), 'message.send', res({ childId: 'c', guardianFlags: flags({ canMessage: true }) }))).toBe(true);
  });
  it('is denied for a child they are not linked to', () => {
    expect(can(actor(['guardian']), 'progress.read', res({ childId: 'other' }))).toBe(false);
  });
  it('can start a join request for any school (no access granted)', () => {
    expect(can(actor(['guardian'], null), 'join.request.create', res({ schoolId: B }))).toBe(true);
    expect(can(actor(['guardian'], null), 'progress.read', res({ schoolId: B }))).toBe(false);
  });
});

describe('teacher', () => {
  it('only acts on own classes', () => {
    expect(can(actor(['teacher']), 'task.assign', res({ actorTeachesClass: false }))).toBe(false);
    expect(can(actor(['teacher']), 'task.assign', res({ actorTeachesClass: true }))).toBe(true);
    expect(can(actor(['teacher']), 'results.write', res({ actorTeachesClass: false }))).toBe(false);
  });
  it('cannot read fees or publish results', () => {
    expect(can(actor(['teacher']), 'fees.read', res())).toBe(false);
    expect(can(actor(['teacher']), 'results.publish', res())).toBe(false);
  });
});

describe('finance and leadership', () => {
  it('bursar reads and manages fees but not results', () => {
    expect(can(actor(['bursar']), 'fees.manage', res())).toBe(true);
    expect(can(actor(['bursar']), 'results.read', res())).toBe(false);
  });
  it('head teacher sees school-wide results and audits messages', () => {
    expect(can(actor(['head_teacher']), 'results.read', res())).toBe(true);
    expect(can(actor(['head_teacher']), 'message.audit', res())).toBe(true);
  });
  it('only school admin decides join requests', () => {
    expect(can(actor(['school_admin']), 'join.request.decide', res())).toBe(true);
    for (const r of ['teacher', 'guardian', 'student', 'bursar'] as Role[]) expect(can(actor([r]), 'join.request.decide', res())).toBe(false);
  });
});

describe('student', () => {
  it('only reads own progress', () => {
    expect(can(actor(['student']), 'progress.read', res({ isSelf: true }))).toBe(true);
    expect(can(actor(['student']), 'progress.read', res({ isSelf: false }))).toBe(false);
  });
  it('cannot see fees', () => expect(can(actor(['student']), 'fees.read', res({ isSelf: true }))).toBe(false));
});

describe('deny by default', () => {
  it('no roles means no access', () => expect(can(actor([]), 'content.read', res())).toBe(false));
});
