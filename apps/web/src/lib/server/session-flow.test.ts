import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { join } from 'node:path';
process.env.CONTENT_DIR = join(__dirname, '../../../../../content');
import { client } from './db';
import { seedSchool } from './testkit';
import { createPackage, chooseSlot, enrolChild, progressFor } from './study';
import { loadContent, libraryTree, lessonForTopic } from './library';
import { applySync } from './session-flow';
afterAll(() => client.end());
beforeAll(() => loadContent(false));

describe('offline sync replay', () => {
  it('quiz and check-in queued offline apply once even if replayed', async () => {
    const s = await seedSchool();
    const pkg = await createPackage(s.admin, { name: 'P', startDate: '2026-12-01', endDate: '2026-12-28', weeklyHourGoal: 9, slotOptions: ['16:00'], subjectIds: [], classIds: [] });
    const enr = await enrolChild(s.guardian, pkg.id, s.childId); await chooseSlot(s.child, enr.id, '16:00', 90);
    const t = (await libraryTree()).find((n) => n.level === 'S1' && n.subject === 'Mathematics')!.topics.find((x) => x.hasLesson)!;
    const l = (await lessonForTopic(t.id))!;
    const q = { type: 'quiz' as const, clientKey: 'off-q1', quizId: l.quizId!, answers: [0, 1, 2, 1] };
    const c = { type: 'checkin' as const, clientKey: 'off-c1', date: '2026-12-01', activeSeconds: 1500 };
    for (let i = 0; i < 3; i++) { expect(await applySync(s.child, q)).toMatchObject({ score: 4 }); expect(await applySync(s.child, c)).toMatchObject({ minutes: 25 }); }
    const p = await progressFor(s.guardian, s.childId, '2026-12-01', '2026-12-07', 0);
    expect(p.minutes).toBe(25); expect(p.days).toEqual(['2026-12-01']);
    await expect(applySync(s.guardian, q)).rejects.toThrow();     // a parent session cannot submit as the student
    await expect(applySync(s.child, { ...c, date: 'tomorrow' })).rejects.toThrow();
  });
});
