import { join } from "node:path";
import { eq } from "drizzle-orm";
import { a as can, F as Forbidden } from "./schools.js";
import { d as db, s as schema, i as inSchool } from "./db.js";
function markQuiz(items, answers) {
  const correct = items.map((it, i) => answers[i] === it.answer);
  return { score: items.reduce((a, it, i) => a + (correct[i] ? it.marks : 0), 0), max: items.reduce((a, it) => a + it.marks, 0), correct };
}
const { levels, subjects, topics, lessons, quizzes, attempts, devotionEntries } = schema;
process.env.CONTENT_DIR ?? join(process.cwd(), "..", "..", "content");
async function libraryTree(track) {
  const rows = await db.select({ track: levels.track, level: levels.code, subject: subjects.name, subjectId: subjects.id, topic: topics.name, topicId: topics.id, lesson: lessons.id }).from(topics).innerJoin(subjects, eq(subjects.id, topics.subjectId)).innerJoin(levels, eq(levels.id, subjects.levelId)).leftJoin(lessons, eq(lessons.topicId, topics.id)).orderBy(levels.track, levels.code, subjects.name, topics.position);
  const out = /* @__PURE__ */ new Map();
  for (const r of rows) {
    if (r.track !== track) continue;
    const k = `${r.track}/${r.level}/${r.subjectId}`;
    if (!out.has(k)) out.set(k, { track: r.track, level: r.level, subject: r.subject, subjectId: r.subjectId, topics: [] });
    const node = out.get(k);
    if (!node.topics.find((t) => t.id === r.topicId)) node.topics.push({ id: r.topicId, name: r.topic, hasLesson: !!r.lesson });
  }
  return [...out.values()];
}
async function lessonForTopic(topicId) {
  const [l] = await db.select().from(lessons).where(eq(lessons.topicId, topicId));
  if (!l) return null;
  const [q] = await db.select().from(quizzes).where(eq(quizzes.topicId, topicId));
  const items = (q?.items ?? []).map(({ q: q2, options, marks }) => ({ q: q2, options, marks }));
  return { lesson: l, quizId: q?.id ?? null, items };
}
async function submitQuiz(actor, quizId, answers, clientKey) {
  if (!actor.schoolId || !can(actor, "content.read", { schoolId: actor.schoolId, isSelf: true })) throw new Forbidden();
  const [q] = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
  if (!q) throw new Forbidden("Quiz not found");
  const items = q.items;
  if (answers.length !== items.length) throw new RangeError("Answer every question or leave it blank");
  const r = markQuiz(items, answers);
  return inSchool(actor.schoolId, async (tx) => {
    const [a] = await tx.insert(attempts).values({ schoolId: actor.schoolId, quizId, studentId: actor.id, answers, score: r.score, max: r.max, clientKey }).onConflictDoNothing().returning();
    const row = a ?? (await tx.select().from(attempts).where(eq(attempts.clientKey, clientKey)))[0];
    if (row.studentId !== actor.id) throw new Forbidden();
    return { score: row.score, max: row.max, feedback: items.map((it, i) => ({ correct: r.correct[i], explain: it.explain, right: it.options[it.answer] })) };
  });
}
async function verseOfTheDay(faith, dayOfYear) {
  if (faith === "off") return null;
  const allowDraft = process.env.ALLOW_DRAFT_DEVOTIONS === "1" && process.env.NODE_ENV !== "production";
  const all = (await db.select().from(devotionEntries)).filter((d) => d.review === "published" || allowDraft).sort((a, b) => a.day - b.day);
  if (!all.length) return null;
  const e = all[dayOfYear % all.length];
  return faith === "light" ? { reference: e.reference } : e;
}
export {
  lessonForTopic as a,
  libraryTree as l,
  submitQuiz as s,
  verseOfTheDay as v
};
