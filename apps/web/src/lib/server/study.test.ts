import { describe, it, expect, afterAll } from 'vitest';
import { client } from './db';
import { seedSchool, login } from './testkit';
import { actorFor } from './auth';
import { createPackage, enrolChild, chooseSlot, startSession, reportActive, progressFor } from './study';
import { Forbidden } from './schools';

afterAll(() => client.end());
const pkgInput = { name: 'Dec Holiday', startDate: '2026-12-01', endDate: '2026-12-28', weeklyHourGoal: 9, slotOptions: ['16:00', '18:00'], subjectIds: [], classIds: [] };

describe('holiday package flow', () => {
  it('admin creates, guardian enrols with consent, child picks slot, sessions sync idempotently', async () => {
    const s = await seedSchool();
    await expect(createPackage(s.guardian, pkgInput)).rejects.toThrow(Forbidden);
    const pkg = await createPackage(s.admin, pkgInput);
    const enr = await enrolChild(s.guardian, pkg.id, s.childId);
    await expect(chooseSlot(s.child, enr.id, '07:00', 90)).rejects.toThrow('not offered');
    await expect(chooseSlot(s.child, enr.id, '16:00', 30)).rejects.toThrow();
    const plan = await chooseSlot(s.child, enr.id, '16:00', 90);
    expect(plan.meetsGoal).toBe(true);

    const a = await startSession(s.child, enr.id, '2026-12-01', 'key-1');
    const b = await startSession(s.child, enr.id, '2026-12-01', 'key-1');   // offline retry
    expect(b.id).toBe(a.id);
    await reportActive(s.child, 'key-1', 1800);
    await reportActive(s.child, 'key-1', 600);                              // stale, out-of-order sync
    const done = await reportActive(s.child, 'key-1', 2400, true);
    expect(done.activeSeconds).toBe(2400); expect(done.checkedInAt).not.toBeNull();

    const p = await progressFor(s.guardian, s.childId, '2026-12-01', '2026-12-07', 0);
    expect(p.days).toEqual(['2026-12-01']); expect(p.minutes).toBe(40); expect(p.goalHours).toBe(9);
    expect((await progressFor(s.teacher, s.childId, '2026-12-01', '2026-12-07', 0)).minutes).toBe(40);
  });

  it('strangers cannot enrol, choose slots, read progress or report time for someone else’s child', async () => {
    const s = await seedSchool(); const other = await seedSchool('Brian');
    const pkg = await createPackage(s.admin, pkgInput);
    await expect(enrolChild(other.guardian, pkg.id, s.childId)).rejects.toThrow();   // different school: RLS hides it
    const enr = await enrolChild(s.guardian, pkg.id, s.childId);
    const rival = await login(); // new account, no school
    await expect(progressFor(await actorFor(rival.userId), s.childId, '2026-12-01', '2026-12-07', 0)).rejects.toThrow(Forbidden);
    await expect(progressFor(other.guardian, s.childId, '2026-12-01', '2026-12-07', 0)).rejects.toThrow();
    await startSession(s.child, enr.id, '2026-12-01', 'k2');
    await expect(reportActive(other.child, 'k2', 999)).rejects.toThrow();
    // a teacher of a different class in the same school cannot see this child
    const t2 = await login(); const { inSchool, schema } = await import('./db');
    await inSchool(s.reg.schoolId, (tx) => tx.insert(schema.userRoles).values({ userId: t2.userId, schoolId: s.reg.schoolId, role: 'teacher' }));
    await expect(progressFor(await actorFor(t2.userId), s.childId, '2026-12-01', '2026-12-07', 0)).rejects.toThrow(Forbidden);
  });

  it('rejects absurd package inputs', async () => {
    const s = await seedSchool();
    await expect(createPackage(s.admin, { ...pkgInput, weeklyHourGoal: 40 })).rejects.toThrow();
    await expect(createPackage(s.admin, { ...pkgInput, slotOptions: ['4pm'] })).rejects.toThrow();
  });
});
