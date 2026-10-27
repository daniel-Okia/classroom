import { eq, and, gte, lte } from "drizzle-orm";
import { s as studyStatus } from "./schedule.js";
import { i as inSchool, s as schema } from "./db.js";
import { m as mondayOf } from "./ctx.js";
const { parentChildLinks, users, packageEnrolments, holidayPackages, sessions, classes, enrolments, attempts, quizzes, topics, schoolSettings, joinRequests } = schema;
const inWindow = (start, end) => {
  const t = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  return t >= start && t <= end;
};
const faithFor = async (schoolId) => (await inSchool(schoolId, (tx) => tx.select().from(schoolSettings)))[0]?.faith ?? "light";
async function childrenOf(actor) {
  return inSchool(actor.schoolId, (tx) => tx.select({ id: users.id, name: users.name }).from(parentChildLinks).innerJoin(users, eq(users.id, parentChildLinks.childId)).where(eq(parentChildLinks.guardianId, actor.id)));
}
async function enrolmentFor(actor, studentId) {
  return inSchool(actor.schoolId, async (tx) => {
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.studentId, studentId));
    if (!e) return null;
    const [p] = await tx.select().from(holidayPackages).where(eq(holidayPackages.id, e.packageId));
    return { ...e, pkg: p };
  });
}
async function openPackages(actor) {
  return inSchool(actor.schoolId, (tx) => tx.select().from(holidayPackages));
}
async function weekFor(actor, studentId) {
  const w = mondayOf();
  return inSchool(actor.schoolId, async (tx) => {
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.studentId, studentId));
    const rows = e ? await tx.select().from(sessions).where(and(eq(sessions.enrolmentId, e.id), gte(sessions.date, w.start), lte(sessions.date, w.end))) : [];
    const [p] = e ? await tx.select().from(holidayPackages).where(eq(holidayPackages.id, e.packageId)) : [];
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.parse(w.start) + i * 864e5).toISOString().slice(0, 10);
      return rows.some((r) => r.date === d && r.checkedInAt);
    });
    const minutes = Math.round(rows.reduce((a, r) => a + r.activeSeconds, 0) / 60);
    const scores = await tx.select({ score: attempts.score, max: attempts.max, topic: topics.name }).from(attempts).innerJoin(quizzes, eq(quizzes.id, attempts.quizId)).innerJoin(topics, eq(topics.id, quizzes.topicId)).where(eq(attempts.studentId, studentId));
    return { days, minutes, goalHours: p?.weeklyHourGoal ?? 0, enrolled: !!e, studyDays: days.filter(Boolean).length, scores, dayIndex: w.dayIndex };
  });
}
async function classOverview(actor) {
  const w = mondayOf();
  return inSchool(actor.schoolId, async (tx) => {
    const mine = actor.roles.includes("teacher") && !actor.roles.some((r) => r === "school_admin" || r === "head_teacher") ? await tx.select().from(classes).where(eq(classes.teacherId, actor.id)) : await tx.select().from(classes);
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
        students.push({ ...k, slot: e?.slotStart ?? null, minutes, goalHours: p?.weeklyHourGoal ?? 0, last: last ? Math.round(last.score / last.max * 100) : null, status: !p ? "not_started" : inWindow(p.startDate, p.endDate) ? studyStatus(minutes, p.weeklyHourGoal, w.dayIndex) : minutes > 0 ? "on_track" : "not_started" });
      }
      out.push({ cls: c, students });
    }
    return out;
  });
}
const pendingJoins = (actor) => inSchool(actor.schoolId, (tx) => tx.select().from(joinRequests).where(eq(joinRequests.status, "pending")));
export {
  classOverview as a,
  childrenOf as c,
  enrolmentFor as e,
  faithFor as f,
  openPackages as o,
  pendingJoins as p,
  weekFor as w
};
