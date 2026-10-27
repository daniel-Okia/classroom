import { and, eq, gte, lte, sql as dsql } from 'drizzle-orm';
import { can, buildSchedule, studyStatus, type Actor } from '@classroom/core';
import { inSchool, schema } from './db';
import { Forbidden } from './schools';

const { classes, enrolments, holidayPackages, packageEnrolments, sessions, consentLog, parentChildLinks, auditLog } = schema;

export interface PackageInput { name: string; startDate: string; endDate: string; weeklyHourGoal: number; slotOptions: string[]; subjectIds: string[]; classIds: string[] }

export async function createPackage(actor: Actor, i: PackageInput) {
  if (!actor.schoolId || !can(actor, 'package.manage', { schoolId: actor.schoolId })) throw new Forbidden();
  if (i.weeklyHourGoal < 1 || i.weeklyHourGoal > 14) throw new RangeError('Weekly goal must be 1-14 hours');
  if (!i.slotOptions.length || i.slotOptions.some((s) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(s))) throw new RangeError('Slot options must be HH:MM');
  return inSchool(actor.schoolId, async (tx) => {
    const [p] = await tx.insert(holidayPackages).values({ ...i, schoolId: actor.schoolId! }).returning();
    await tx.insert(auditLog).values({ schoolId: actor.schoolId, actorId: actor.id, action: 'package.create', target: p!.id });
    return p!;
  });
}

/**
 * A guardian enrols a linked child. Parent consent is recorded (required for under-18s, and we treat every
 * learner as a minor unless the school says otherwise). Enrolling an unlinked child is refused.
 */
export async function enrolChild(actor: Actor, packageId: string, childId: string) {
  if (!actor.schoolId) throw new Forbidden();
  const schoolId = actor.schoolId;
  return inSchool(schoolId, async (tx) => {
    const [link] = await tx.select().from(parentChildLinks).where(and(eq(parentChildLinks.guardianId, actor.id), eq(parentChildLinks.childId, childId)));
    if (!link) throw new Forbidden('You are not linked to this child');
    const [pkg] = await tx.select().from(holidayPackages).where(eq(holidayPackages.id, packageId));
    if (!pkg) throw new Forbidden('Package not found');
    const [consent] = await tx.insert(consentLog).values({ schoolId, subjectId: childId, givenBy: actor.id, purpose: `holiday_package:${packageId}` }).returning();
    const [e] = await tx.insert(packageEnrolments).values({ schoolId, packageId, studentId: childId, consentLogId: consent!.id }).onConflictDoNothing().returning();
    return e ?? (await tx.select().from(packageEnrolments).where(and(eq(packageEnrolments.packageId, packageId), eq(packageEnrolments.studentId, childId))))[0]!;
  });
}

/** Student or their guardian picks the daily slot (1-2 hours, one of the school's options). */
export async function chooseSlot(actor: Actor, enrolmentId: string, slotStart: string, minutes: number) {
  if (!actor.schoolId) throw new Forbidden();
  return inSchool(actor.schoolId, async (tx) => {
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.id, enrolmentId));
    if (!e) throw new Forbidden('Enrolment not found');
    const mine = e.studentId === actor.id || !!(await tx.select().from(parentChildLinks).where(and(eq(parentChildLinks.guardianId, actor.id), eq(parentChildLinks.childId, e.studentId))))[0];
    if (!mine) throw new Forbidden();
    const [pkg] = await tx.select().from(holidayPackages).where(eq(holidayPackages.id, e.packageId));
    if (!pkg!.slotOptions.includes(slotStart)) throw new RangeError('That start time is not offered by the school');
    const plan = buildSchedule({ startDate: pkg!.startDate, endDate: pkg!.endDate, weeklyHourGoal: pkg!.weeklyHourGoal, slotStart, slotMinutes: minutes });
    await tx.update(packageEnrolments).set({ slotStart, slotMinutes: minutes }).where(eq(packageEnrolments.id, enrolmentId));
    return plan;
  });
}

/** Offline-safe: the clientKey makes retries idempotent. Same key returns the same session. */
export async function startSession(actor: Actor, enrolmentId: string, date: string, clientKey: string) {
  if (!actor.schoolId) throw new Forbidden();
  return inSchool(actor.schoolId, async (tx) => {
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.id, enrolmentId));
    if (!e || e.studentId !== actor.id) throw new Forbidden();
    const [s] = await tx.insert(sessions).values({ schoolId: actor.schoolId!, enrolmentId, date, clientKey }).onConflictDoNothing().returning();
    return s ?? (await tx.select().from(sessions).where(eq(sessions.clientKey, clientKey)))[0]!;
  });
}

/** Active time is reported as a running total (max wins), so repeated or out-of-order syncs never double count. */
export async function reportActive(actor: Actor, clientKey: string, totalSeconds: number, checkIn = false) {
  if (!actor.schoolId) throw new Forbidden();
  const capped = Math.max(0, Math.min(totalSeconds, 4 * 3600));
  return inSchool(actor.schoolId, async (tx) => {
    const [s] = await tx.select().from(sessions).where(eq(sessions.clientKey, clientKey));
    if (!s) throw new Forbidden();
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.id, s.enrolmentId));
    if (e!.studentId !== actor.id) throw new Forbidden();
    const [u] = await tx.update(sessions).set({ activeSeconds: dsql`greatest(${sessions.activeSeconds}, ${capped})`, ...(checkIn && !s.checkedInAt ? { checkedInAt: new Date() } : {}) }).where(eq(sessions.id, s.id)).returning();
    return u!;
  });
}

/** Study days, minutes vs goal, status. Only the child, their guardians, and that class's teachers/admins may read. */
export async function progressFor(actor: Actor, childId: string, weekStart: string, weekEnd: string, dayIndex: number) {
  if (!actor.schoolId) throw new Forbidden();
  const schoolId = actor.schoolId;
  return inSchool(schoolId, async (tx) => {
    const [link] = await tx.select().from(parentChildLinks).where(and(eq(parentChildLinks.guardianId, actor.id), eq(parentChildLinks.childId, childId)));
    const taught = await tx.select({ id: classes.id }).from(classes).innerJoin(enrolments, eq(enrolments.classId, classes.id)).where(and(eq(classes.teacherId, actor.id), eq(enrolments.studentId, childId)));
    const allowed = can(actor, 'progress.read', { schoolId, childId, isSelf: actor.id === childId, guardianFlags: link ? { canPay: link.canPay, canViewResults: link.canViewResults, canMessage: link.canMessage, mayCollect: link.mayCollect } : undefined, actorTeachesClass: taught.length > 0 });
    if (!allowed) throw new Forbidden();
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.studentId, childId));
    if (!e) return { days: [] as string[], minutes: 0, goalHours: 0, status: 'not_started' as const };
    const [pkg] = await tx.select().from(holidayPackages).where(eq(holidayPackages.id, e.packageId));
    const rows = await tx.select().from(sessions).where(and(eq(sessions.enrolmentId, e.id), gte(sessions.date, weekStart), lte(sessions.date, weekEnd)));
    const days = [...new Set(rows.filter((r) => r.checkedInAt).map((r) => r.date))].sort();
    const minutes = Math.round(rows.reduce((a, r) => a + r.activeSeconds, 0) / 60);
    return { days, minutes, goalHours: pkg!.weeklyHourGoal, status: studyStatus(minutes, pkg!.weeklyHourGoal, dayIndex) };
  });
}
