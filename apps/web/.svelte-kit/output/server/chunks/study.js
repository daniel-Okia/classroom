import { eq, and, sql } from "drizzle-orm";
import { F as Forbidden, a as can } from "./schools.js";
import { b as buildSchedule } from "./schedule.js";
import { i as inSchool, s as schema } from "./db.js";
const { holidayPackages, packageEnrolments, sessions, consentLog, parentChildLinks, auditLog } = schema;
async function createPackage(actor, i) {
  if (!actor.schoolId || !can(actor, "package.manage", { schoolId: actor.schoolId })) throw new Forbidden();
  if (i.weeklyHourGoal < 1 || i.weeklyHourGoal > 14) throw new RangeError("Weekly goal must be 1-14 hours");
  if (!i.slotOptions.length || i.slotOptions.some((s) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(s))) throw new RangeError("Slot options must be HH:MM");
  return inSchool(actor.schoolId, async (tx) => {
    const [p] = await tx.insert(holidayPackages).values({ ...i, schoolId: actor.schoolId }).returning();
    await tx.insert(auditLog).values({ schoolId: actor.schoolId, actorId: actor.id, action: "package.create", target: p.id });
    return p;
  });
}
async function enrolChild(actor, packageId, childId) {
  if (!actor.schoolId) throw new Forbidden();
  const schoolId = actor.schoolId;
  return inSchool(schoolId, async (tx) => {
    const [link] = await tx.select().from(parentChildLinks).where(and(eq(parentChildLinks.guardianId, actor.id), eq(parentChildLinks.childId, childId)));
    if (!link) throw new Forbidden("You are not linked to this child");
    const [pkg] = await tx.select().from(holidayPackages).where(eq(holidayPackages.id, packageId));
    if (!pkg) throw new Forbidden("Package not found");
    const [consent] = await tx.insert(consentLog).values({ schoolId, subjectId: childId, givenBy: actor.id, purpose: `holiday_package:${packageId}` }).returning();
    const [e] = await tx.insert(packageEnrolments).values({ schoolId, packageId, studentId: childId, consentLogId: consent.id }).onConflictDoNothing().returning();
    return e ?? (await tx.select().from(packageEnrolments).where(and(eq(packageEnrolments.packageId, packageId), eq(packageEnrolments.studentId, childId))))[0];
  });
}
async function chooseSlot(actor, enrolmentId, slotStart, minutes) {
  if (!actor.schoolId) throw new Forbidden();
  return inSchool(actor.schoolId, async (tx) => {
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.id, enrolmentId));
    if (!e) throw new Forbidden("Enrolment not found");
    const mine = e.studentId === actor.id || !!(await tx.select().from(parentChildLinks).where(and(eq(parentChildLinks.guardianId, actor.id), eq(parentChildLinks.childId, e.studentId))))[0];
    if (!mine) throw new Forbidden();
    const [pkg] = await tx.select().from(holidayPackages).where(eq(holidayPackages.id, e.packageId));
    if (!pkg.slotOptions.includes(slotStart)) throw new RangeError("That start time is not offered by the school");
    const plan = buildSchedule({ startDate: pkg.startDate, endDate: pkg.endDate, weeklyHourGoal: pkg.weeklyHourGoal, slotStart, slotMinutes: minutes });
    await tx.update(packageEnrolments).set({ slotStart, slotMinutes: minutes }).where(eq(packageEnrolments.id, enrolmentId));
    return plan;
  });
}
async function startSession(actor, enrolmentId, date, clientKey) {
  if (!actor.schoolId) throw new Forbidden();
  return inSchool(actor.schoolId, async (tx) => {
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.id, enrolmentId));
    if (!e || e.studentId !== actor.id) throw new Forbidden();
    const [s] = await tx.insert(sessions).values({ schoolId: actor.schoolId, enrolmentId, date, clientKey }).onConflictDoNothing().returning();
    return s ?? (await tx.select().from(sessions).where(eq(sessions.clientKey, clientKey)))[0];
  });
}
async function reportActive(actor, clientKey, totalSeconds, checkIn = false) {
  if (!actor.schoolId) throw new Forbidden();
  const capped = Math.max(0, Math.min(totalSeconds, 4 * 3600));
  return inSchool(actor.schoolId, async (tx) => {
    const [s] = await tx.select().from(sessions).where(eq(sessions.clientKey, clientKey));
    if (!s) throw new Forbidden();
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.id, s.enrolmentId));
    if (e.studentId !== actor.id) throw new Forbidden();
    const [u] = await tx.update(sessions).set({ activeSeconds: sql`greatest(${sessions.activeSeconds}, ${capped})`, ...checkIn && !s.checkedInAt ? { checkedInAt: /* @__PURE__ */ new Date() } : {} }).where(eq(sessions.id, s.id)).returning();
    return u;
  });
}
export {
  chooseSlot as a,
  createPackage as c,
  enrolChild as e,
  reportActive as r,
  startSession as s
};
