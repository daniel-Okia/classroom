import { describe, it, expect, afterAll } from 'vitest';
import { client, inSchool, schema } from './db';
import { seedSchool, login } from './testkit';
import { actorFor } from './auth';
import { assignTask, tasksForStudent, submitAnswer, reviewQueue, markSubmission, myFeedback } from './tasks';
import { Forbidden } from './schools';
afterAll(() => client.end());

describe('tasks and marking', () => {
  it('teacher assigns, student submits (idempotent), teacher marks, guardian sees feedback', async () => {
    const s = await seedSchool();
    const t = await assignTask(s.teacher, { classId: s.cls.id, title: 'Quadratics 1', instructions: 'Solve x^2 - 5x + 6 = 0. Show working.' });
    expect((await tasksForStudent(s.child)).map((x) => x.id)).toContain(t.id);
    const a = await submitAnswer(s.child, t.id, '(x-2)(x-3)=0 so x=2 or 3', null, 'sub-1');
    const b = await submitAnswer(s.child, t.id, 'different text', null, 'sub-1');   // offline retry
    expect(b.id).toBe(a.id);
    const q = await reviewQueue(s.teacher); expect(q).toHaveLength(1); expect(q[0]!.markId).toBeNull();
    await expect(markSubmission(s.teacher, a.id, 5, 4, 'x')).rejects.toThrow(RangeError);
    await markSubmission(s.teacher, a.id, 3, 4, 'Good. Check your signs.');
    await markSubmission(s.teacher, a.id, 4, 4, 'Great fix.');                        // re-mark overwrites, audited
    const fb = await myFeedback(s.guardian, s.childId);
    expect(fb).toEqual([{ title: 'Quadratics 1', score: 4, max: 4, comment: 'Great fix.' }]);
    const audits = await inSchool(s.reg.schoolId, (tx) => tx.select().from(schema.auditLog));
    expect(audits.filter((x) => x.action === 'submission.mark')).toHaveLength(2);
  });

  it('only the class teacher can assign or mark; students cannot assign; outsiders see nothing', async () => {
    const s = await seedSchool();
    await expect(assignTask(s.child, { classId: s.cls.id, title: 't', instructions: 'i' })).rejects.toThrow(Forbidden);
    await expect(assignTask(s.guardian, { classId: s.cls.id, title: 't', instructions: 'i' })).rejects.toThrow(Forbidden);
    const t2 = await login(); await inSchool(s.reg.schoolId, (tx) => tx.insert(schema.userRoles).values({ userId: t2.userId, schoolId: s.reg.schoolId, role: 'teacher' }));
    const other = await actorFor(t2.userId);
    await expect(assignTask(other, { classId: s.cls.id, title: 't', instructions: 'i' })).rejects.toThrow(Forbidden);
    const t = await assignTask(s.teacher, { classId: s.cls.id, title: 'T', instructions: 'I' });
    const sub = await submitAnswer(s.child, t.id, 'work', null, 'k');
    await expect(markSubmission(other, sub.id, 1, 1, '')).rejects.toThrow(Forbidden);
    expect(await reviewQueue(other)).toHaveLength(0);
    const o = await seedSchool('Other');
    await expect(submitAnswer(o.child, t.id, 'sneaky', null, 'k9')).rejects.toThrow();
    await expect(myFeedback(o.guardian, s.childId)).rejects.toThrow();
    await expect(submitAnswer(s.child, t.id, '  ', null, 'k8')).rejects.toThrow(RangeError);
  });
});
