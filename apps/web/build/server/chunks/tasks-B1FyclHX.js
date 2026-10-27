import { eq, and } from 'drizzle-orm';
import { F as Forbidden, e as can } from './schools-CPeH0e6J.js';
import { i as inSchool, s as schema } from './db-4b7EjHA-.js';

const { tasks, submissions, marks, classes, enrolments, auditLog, parentChildLinks } = schema;
const MAX_TEXT = 8e3;
async function teachesClass(tx, actor, classId) {
  const [c] = await tx.select().from(classes).where(eq(classes.id, classId));
  return !!c && c.teacherId === actor.id;
}
async function assignTask(actor, i) {
  if (!actor.schoolId) throw new Forbidden();
  return inSchool(actor.schoolId, async (tx) => {
    if (!can(actor, "task.assign", { schoolId: actor.schoolId, actorTeachesClass: await teachesClass(tx, actor, i.classId) })) throw new Forbidden();
    const [t] = await tx.insert(tasks).values({ schoolId: actor.schoolId, teacherId: actor.id, classId: i.classId, title: i.title.trim(), instructions: i.instructions.trim(), dueDate: i.dueDate, topicId: i.topicId }).returning();
    return t;
  });
}
async function tasksForStudent(actor) {
  if (!actor.schoolId) throw new Forbidden();
  return inSchool(actor.schoolId, (tx) => tx.select({ id: tasks.id, title: tasks.title, instructions: tasks.instructions, dueDate: tasks.dueDate }).from(tasks).innerJoin(enrolments, eq(enrolments.classId, tasks.classId)).where(eq(enrolments.studentId, actor.id)));
}
async function submitAnswer(actor, taskId, answerText, photoKey, clientKey) {
  if (!actor.schoolId) throw new Forbidden();
  if (!answerText?.trim() && !photoKey) throw new RangeError("Add some working or a photo");
  if ((answerText?.length ?? 0) > MAX_TEXT) throw new RangeError("Answer is too long");
  return inSchool(actor.schoolId, async (tx) => {
    const mine = await tx.select({ id: tasks.id }).from(tasks).innerJoin(enrolments, eq(enrolments.classId, tasks.classId)).where(and(eq(tasks.id, taskId), eq(enrolments.studentId, actor.id)));
    if (!mine.length || !can(actor, "content.read", { schoolId: actor.schoolId, isSelf: true })) throw new Forbidden();
    const [s] = await tx.insert(submissions).values({ schoolId: actor.schoolId, taskId, studentId: actor.id, answerText, photoKey, clientKey }).onConflictDoNothing().returning();
    return s ?? (await tx.select().from(submissions).where(and(eq(submissions.taskId, taskId), eq(submissions.studentId, actor.id))))[0];
  });
}
async function reviewQueue(actor) {
  if (!actor.schoolId) throw new Forbidden();
  return inSchool(actor.schoolId, async (tx) => {
    const rows = await tx.select({ id: submissions.id, taskTitle: tasks.title, studentId: submissions.studentId, text: submissions.answerText, photoKey: submissions.photoKey, moderation: submissions.moderation, markId: marks.id }).from(submissions).innerJoin(tasks, eq(tasks.id, submissions.taskId)).leftJoin(marks, eq(marks.submissionId, submissions.id)).where(eq(tasks.teacherId, actor.id));
    return rows;
  });
}
async function markSubmission(actor, submissionId, score, max, comment) {
  if (!actor.schoolId) throw new Forbidden();
  if (!(max > 0) || score < 0 || score > max) throw new RangeError("Score must be between 0 and the maximum");
  return inSchool(actor.schoolId, async (tx) => {
    const [row] = await tx.select({ s: submissions, classId: tasks.classId }).from(submissions).innerJoin(tasks, eq(tasks.id, submissions.taskId)).where(eq(submissions.id, submissionId));
    if (!row || !can(actor, "submission.mark", { schoolId: actor.schoolId, classId: row.classId, actorTeachesClass: await teachesClass(tx, actor, row.classId) })) throw new Forbidden();
    const [m] = await tx.insert(marks).values({ schoolId: actor.schoolId, submissionId, markerId: actor.id, score, max, comment }).onConflictDoUpdate({ target: marks.submissionId, set: { score, max, comment, markerId: actor.id, at: /* @__PURE__ */ new Date() } }).returning();
    await tx.insert(auditLog).values({ schoolId: actor.schoolId, actorId: actor.id, action: "submission.mark", target: submissionId, detail: { score, max } });
    return m;
  });
}
async function myFeedback(actor, childId) {
  if (!actor.schoolId) throw new Forbidden();
  return inSchool(actor.schoolId, async (tx) => {
    const [link] = await tx.select().from(parentChildLinks).where(and(eq(parentChildLinks.guardianId, actor.id), eq(parentChildLinks.childId, childId)));
    if (actor.id !== childId && !link) throw new Forbidden();
    return tx.select({ title: tasks.title, score: marks.score, max: marks.max, comment: marks.comment }).from(submissions).innerJoin(tasks, eq(tasks.id, submissions.taskId)).innerJoin(marks, eq(marks.submissionId, submissions.id)).where(eq(submissions.studentId, childId));
  });
}

export { markSubmission as a, assignTask as b, myFeedback as m, reviewQueue as r, submitAnswer as s, tasksForStudent as t };
//# sourceMappingURL=tasks-B1FyclHX.js.map
