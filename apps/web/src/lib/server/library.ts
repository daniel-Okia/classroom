import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { and, eq } from 'drizzle-orm';
import { parseLesson, releaseGate, markQuiz, type QuizItem } from '@classroom/content';
import { can, type Actor } from '@classroom/core';
import { db, inSchool, schema } from './db';
import { Forbidden } from './schools';

const { levels, subjects, topics, lessons, quizzes, attempts, resources, devotionEntries } = schema;
const root = process.env.CONTENT_DIR ?? join(process.cwd(), '..', '..', 'content');

/** Idempotently load taxonomy + lessons into the DB. In production only publishable, teacher-published lessons load. */
export async function loadContent(production = process.env.NODE_ENV === 'production') {
  const tx = JSON.parse(readFileSync(join(root, 'taxonomy', 'taxonomy.json'), 'utf8'));
  const dir = join(root, 'lessons');
  const parsed = readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => parseLesson(f, readFileSync(join(dir, f), 'utf8')));
  const { ok, blocked } = releaseGate(parsed, production);
  const topicIds = new Map<string, string>();
  for (const t of tx.tracks) for (const l of t.levels) {
    let [lv] = await db.select().from(levels).where(and(eq(levels.track, t.track), eq(levels.code, l.code)));
    if (!lv) [lv] = await db.insert(levels).values({ track: t.track, code: l.code, name: l.name }).returning();
    for (const s of l.subjects) {
      let [sb] = await db.select().from(subjects).where(and(eq(subjects.levelId, lv!.id), eq(subjects.code, s.code)));
      if (!sb) [sb] = await db.insert(subjects).values({ levelId: lv!.id, code: s.code, name: s.name }).returning();
      let pos = 0;
      for (const name of s.topics as string[]) {
        let [tp] = await db.select().from(topics).where(and(eq(topics.subjectId, sb!.id), eq(topics.name, name)));
        if (!tp) [tp] = await db.insert(topics).values({ subjectId: sb!.id, name, position: pos }).returning();
        topicIds.set(`${t.track}/${l.code}/${s.code}/${name.toLowerCase()}`, tp!.id); pos++;
      }
    }
  }
  let loaded = 0;
  for (const l of ok) {
    const topicId = topicIds.get(`${l.track}/${l.level}/${l.subject}/${l.topic.toLowerCase()}`);
    if (!topicId) throw new Error(`${l.id}: topic "${l.topic}" not in taxonomy`);
    const [existing] = await db.select().from(lessons).where(and(eq(lessons.topicId, topicId), eq(lessons.title, l.title)));
    if (existing) { await db.update(lessons).set({ bodyMd: l.body, review: l.review }).where(eq(lessons.id, existing.id)); continue; }
    const [res] = await db.insert(resources).values({ title: l.title, sourceUrl: null, licence: l.licence, verdict: 'ORIGINAL', publishable: l.publishable }).returning();
    await db.insert(lessons).values({ topicId, title: l.title, bodyMd: l.body, resourceId: res!.id, review: l.review });
    await db.insert(quizzes).values({ topicId, title: `${l.title}: check yourself`, items: l.quiz });
    loaded++;
  }
  return { loaded, blocked };
}

export interface TreeNode { track: string; level: string; subject: string; subjectId: string; topics: { id: string; name: string; hasLesson: boolean }[] }
export async function libraryTree(track?: 'new' | 'legacy'): Promise<TreeNode[]> {
  const rows = await db.select({ track: levels.track, level: levels.code, subject: subjects.name, subjectId: subjects.id, topic: topics.name, topicId: topics.id, lesson: lessons.id })
    .from(topics).innerJoin(subjects, eq(subjects.id, topics.subjectId)).innerJoin(levels, eq(levels.id, subjects.levelId)).leftJoin(lessons, eq(lessons.topicId, topics.id))
    .orderBy(levels.track, levels.code, subjects.name, topics.position);
  const out = new Map<string, TreeNode>();
  for (const r of rows) {
    if (track && r.track !== track) continue;
    const k = `${r.track}/${r.level}/${r.subjectId}`;
    if (!out.has(k)) out.set(k, { track: r.track, level: r.level, subject: r.subject, subjectId: r.subjectId, topics: [] });
    const node = out.get(k)!; if (!node.topics.find((t) => t.id === r.topicId)) node.topics.push({ id: r.topicId, name: r.topic, hasLesson: !!r.lesson });
  }
  return [...out.values()];
}

export async function lessonForTopic(topicId: string) {
  const [l] = await db.select().from(lessons).where(eq(lessons.topicId, topicId));
  if (!l) return null;
  const [q] = await db.select().from(quizzes).where(eq(quizzes.topicId, topicId));
  // The answer key never leaves the server in the lesson payload; offline packs ship it separately, signed to the enrolment (Phase 2).
  const items = ((q?.items as QuizItem[]) ?? []).map(({ q, options, marks }) => ({ q, options, marks }));
  return { lesson: l, quizId: q?.id ?? null, items };
}

/** Auto-mark and store an attempt. clientKey makes offline retries idempotent. Returns per-item feedback. */
export async function submitQuiz(actor: Actor, quizId: string, answers: (number | null)[], clientKey: string) {
  if (!actor.schoolId || !can(actor, 'content.read', { schoolId: actor.schoolId, isSelf: true })) throw new Forbidden();
  const [q] = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
  if (!q) throw new Forbidden('Quiz not found');
  const items = q.items as QuizItem[];
  if (answers.length !== items.length) throw new RangeError('Answer every question or leave it blank');
  const r = markQuiz(items, answers);
  return inSchool(actor.schoolId, async (tx) => {
    const [a] = await tx.insert(attempts).values({ schoolId: actor.schoolId!, quizId, studentId: actor.id, answers, score: r.score, max: r.max, clientKey }).onConflictDoNothing().returning();
    const row = a ?? (await tx.select().from(attempts).where(eq(attempts.clientKey, clientKey)))[0]!;
    if (row.studentId !== actor.id) throw new Forbidden();
    return { score: row.score!, max: row.max!, feedback: items.map((it, i) => ({ correct: r.correct[i]!, explain: it.explain, right: it.options[it.answer]! })) };
  });
}

/** Seed a tiny devotion plan (public-domain KJV text). Status is `draft` until a chaplain marks it reviewed. */
export const DEVOTION_SEED = [
  { day: 1, reference: 'Colossians 3:23 (KJV)', reflection: 'Whatever work is in front of you today, do it with your whole heart.', question: 'What is one thing you can do with extra care today?' },
  { day: 2, reference: 'Proverbs 3:5 (KJV)', reflection: 'Trust does not mean we stop trying. It means we try, and we rest in God too.', question: 'Who helps you when something is hard?' },
  { day: 3, reference: 'Proverbs 1:7 (KJV)', reflection: 'Wisdom starts with respect and a humble, teachable heart.', question: 'What would you like to learn this week?' },
  { day: 4, reference: 'Philippians 4:13 (KJV)', reflection: 'Strength to keep going is a gift. Ask for it.', question: 'What feels too big right now? Take one small step.' },
];
export async function seedDevotions() {
  for (const d of DEVOTION_SEED) {
    const [e] = await db.select().from(devotionEntries).where(eq(devotionEntries.day, d.day));
    if (!e) await db.insert(devotionEntries).values({ ...d, review: 'draft' });
  }
}
/** Faith setting aware. Off hides everything; only chaplain-published entries are served (drafts only when ALLOW_DRAFT_DEVOTIONS=1, dev only). */
export async function verseOfTheDay(faith: 'full' | 'light' | 'off', dayOfYear: number) {
  if (faith === 'off') return null;
  const allowDraft = process.env.ALLOW_DRAFT_DEVOTIONS === '1' && process.env.NODE_ENV !== 'production';
  const all = (await db.select().from(devotionEntries)).filter((d) => d.review === 'published' || allowDraft).sort((a, b) => a.day - b.day);
  if (!all.length) return null;
  const e = all[dayOfYear % all.length]!;
  return faith === 'light' ? { reference: e.reference } : e;
}
