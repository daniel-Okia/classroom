import type { Actor } from '@classroom/core';
import { eq } from 'drizzle-orm';
import { inSchool, schema } from './db';
import { submitQuiz } from './library';
import { startSession, reportActive } from './study';
import { Forbidden } from './schools';

/** One entry point for queued offline writes. Every item carries a clientKey so replays are harmless. */
export type SyncItem =
  | { type: 'quiz'; clientKey: string; quizId: string; answers: (number | null)[] }
  | { type: 'checkin'; clientKey: string; date: string; activeSeconds: number };

export async function applySync(actor: Actor, item: SyncItem) {
  if (!actor.roles.includes('student') || !actor.schoolId) throw new Forbidden('Open the app as the student to sync');
  if (item.type === 'quiz') return { type: 'quiz' as const, ...(await submitQuiz(actor, item.quizId, item.answers, item.clientKey)) };
  if (item.type === 'checkin') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) throw new RangeError('Bad date');
    const e = await inSchool(actor.schoolId, async (tx) => (await tx.select().from(schema.packageEnrolments).where(eq(schema.packageEnrolments.studentId, actor.id)))[0]);
    if (!e) return { type: 'checkin' as const, skipped: true };
    await startSession(actor, e.id, item.date, item.clientKey);
    const s = await reportActive(actor, item.clientKey, item.activeSeconds, true);
    return { type: 'checkin' as const, minutes: Math.round(s.activeSeconds / 60) };
  }
  throw new RangeError('Unknown item');
}
