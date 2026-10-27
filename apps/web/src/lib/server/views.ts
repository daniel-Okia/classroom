import { and, eq, gte, lte, inArray } from 'drizzle-orm';
import { studyStatus, type Actor } from '@classroom/core';
import { inSchool, schema } from './db';
import { mondayOf } from './ctx';

const { parentChildLinks, users, packageEnrolments, holidayPackages, sessions, classes, enrolments, attempts, quizzes, topics, schoolSettings, joinRequests } = schema;

/** Behind/on-track is only judged while the package is running. */
const inWindow = (start: string, end: string) => { const t = new Date().toISOString().slice(0, 10); return t >= start && t <= end; };

export const faithFor = async (schoolId: string) => (await inSchool(schoolId, (tx) => tx.select().from(schoolSettings)))[0]?.faith ?? 'light';

export async function childrenOf(actor: Actor) {
  return inSchool(actor.schoolId!, (tx) => tx.select({ id: users.id, name: users.name }).from(parentChildLinks).innerJoin(users, eq(users.id, parentChildLinks.childId)).where(eq(parentChildLinks.guardianId, actor.id)));
}

export async function enrolmentFor(actor: Actor, studentId: string) {
  return inSchool(actor.schoolId!, async (tx) => {
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.studentId, studentId));
    if (!e) return null;
    const [p] = await tx.select().from(holidayPackages).where(eq(holidayPackages.id, e.packageId));
    return { ...e, pkg: p! };
  });
}

export async function openPackages(actor: Actor) { return inSchool(actor.schoolId!, (tx) => tx.select().from(holidayPackages)); }

/** Weekly picture for one child: days studied (Mon..Sun flags), minutes, goal, latest quiz scores. */
export async function weekFor(actor: Actor, studentId: string) {
  const w = mondayOf();
  return inSchool(actor.schoolId!, async (tx) => {
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.studentId, studentId));
    const rows = e ? await tx.select().from(sessions).where(and(eq(sessions.enrolmentId, e.id), gte(sessions.date, w.start), lte(sessions.date, w.end))) : [];
    const [p] = e ? await tx.select().from(holidayPackages).where(eq(holidayPackages.id, e.packageId)) : [];
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(Date.parse(w.start) + i * 864e5).toISOString().slice(0, 10); return rows.some((r) => r.date === d && r.checkedInAt); });
    const minutes = Math.round(rows.reduce((a, r) => a + r.activeSeconds, 0) / 60);
    const scores = await tx.select({ score: attempts.score, max: attempts.max, topic: topics.name }).from(attempts).innerJoin(quizzes, eq(quizzes.id, attempts.quizId)).innerJoin(topics, eq(topics.id, quizzes.topicId)).where(eq(attempts.studentId, studentId));
    return { days, minutes, goalHours: p?.weeklyHourGoal ?? 0, enrolled: !!e, studyDays: days.filter(Boolean).length, scores, dayIndex: w.dayIndex };
  });
}

/** Teacher overview: students per class with weekly minutes and status. */
export async function classOverview(actor: Actor) {
  const w = mondayOf();
  return inSchool(actor.schoolId!, async (tx) => {
    const mine = actor.roles.includes('teacher') && !actor.roles.some((r) => r === 'school_admin' || r === 'head_teacher')
      ? await tx.select().from(classes).where(eq(classes.teacherId, actor.id)) : await tx.select().from(classes);
    const out = [];
    for (const c of mine) {
      const kids = await tx.select({ id: users.id, name: users.name }).from(enrolments).innerJoin(users, eq(users.id, enrolments.studentId)).where(eq(enrolments.classId, c.id));
      const students = [];
      for (const k of kids) {
        const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.studentId, k.id));
        const [p] = e ? await tx.select().from(holidayPackages).where(eq(holidayPackages.id, e.packageId)) : [];
        const rows = e ? await tx.select().from(sessions).where(and(eq(sessions.enrolmentId, e.id), gte(sessions.date, w.start), lte(sessions.date, w.end))) : [];
        const minutes = Math.round(rows.reduce((a, r) => a + r.activeSeconds, 0) / 60);
        const last = (await tx.select({ score: attempts.score, max: attempts.max }).from(attempts).where(eq(attempts.studentId, k.id))).at(-1);
        students.push({ ...k, slot: e?.slotStart ?? null, minutes, goalHours: p?.weeklyHourGoal ?? 0, last: last ? Math.round((last.score! / last.max!) * 100) : null, status: !p ? 'not_started' as const : inWindow(p.startDate, p.endDate) ? studyStatus(minutes, p.weeklyHourGoal, w.dayIndex) : minutes > 0 ? 'on_track' as const : 'not_started' as const });
      }
      out.push({ cls: c, students });
    }
    return out;
  });
}
export const pendingJoins = (actor: Actor) => inSchool(actor.schoolId!, (tx) => tx.select().from(joinRequests).where(eq(joinRequests.status, 'pending')));
void inArray;
