export type Track = 'new' | 'legacy';
export type Review = 'draft' | 'reviewed' | 'published';
export interface QuizItem { q: string; options: string[]; answer: number; explain: string; marks: number }
export interface Lesson {
  id: string; track: Track; level: string; subject: string; topic: string; title: string;
  author: string; review: Review; wisdom?: string; source: string; licence: string; publishable: boolean;
  body: string; quiz: QuizItem[];
}

const REQUIRED = ['id', 'track', 'level', 'subject', 'topic', 'title', 'author', 'review', 'source', 'licence', 'publishable'];
/** Sections every lesson must have, in this order (brief: key idea / worked example / practice / check yourself). */
export const SECTIONS = ['Key idea', 'Worked example', 'Practice', 'Check yourself'] as const;

/** Parse a lesson file: flat `key: value` front-matter, Markdown+KaTeX body, and a ```quiz JSON block. Throws on invalid input. */
export function parseLesson(file: string, text: string): Lesson {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front-matter`);
  const meta: Record<string, string> = {};
  for (const line of m[1]!.split('\n')) { const k = line.match(/^([a-z_]+):\s*(.*)$/); if (k) meta[k[1]!] = k[2]!.trim(); }
  for (const k of REQUIRED) if (!meta[k]) throw new Error(`${file}: missing "${k}"`);
  if (!['new', 'legacy'].includes(meta.track!)) throw new Error(`${file}: track must be new|legacy`);
  if (!['draft', 'reviewed', 'published'].includes(meta.review!)) throw new Error(`${file}: bad review status`);
  let body = m[2]!.trim(); let quiz: QuizItem[] = [];
  const q = body.match(/```quiz\n([\s\S]*?)\n```/);
  if (q) { quiz = JSON.parse(q[1]!); body = body.replace(q[0], '').trim(); }
  const headings = [...body.matchAll(/^## (.+)$/gm)].map((h) => h[1]!.trim());
  for (const s of SECTIONS) if (!headings.includes(s)) throw new Error(`${file}: missing section "## ${s}"`);
  if (JSON.stringify(headings.filter((h) => (SECTIONS as readonly string[]).includes(h))) !== JSON.stringify(SECTIONS)) throw new Error(`${file}: sections out of order`);
  quiz.forEach((it, i) => {
    if (!it.q || !Array.isArray(it.options) || it.options.length < 2) throw new Error(`${file}: quiz item ${i + 1} needs a question and 2+ options`);
    if (!Number.isInteger(it.answer) || it.answer < 0 || it.answer >= it.options.length) throw new Error(`${file}: quiz item ${i + 1} answer index out of range`);
    if (!it.explain) throw new Error(`${file}: quiz item ${i + 1} needs an explanation`);
    if (!(it.marks >= 1)) throw new Error(`${file}: quiz item ${i + 1} needs marks`);
  });
  return { id: meta.id!, track: meta.track as Track, level: meta.level!, subject: meta.subject!, topic: meta.topic!, title: meta.title!, author: meta.author!, review: meta.review as Review,
    wisdom: meta.wisdom, source: meta.source!, licence: meta.licence!, publishable: meta.publishable === 'true', body, quiz };
}

/** Production builds may only contain publishable lessons that a teacher has marked published. */
export function releaseGate(lessons: Lesson[], production: boolean): { ok: Lesson[]; blocked: { id: string; reason: string }[] } {
  const ok: Lesson[] = [], blocked: { id: string; reason: string }[] = [];
  for (const l of lessons) {
    if (!production) { ok.push(l); continue; }
    if (!l.publishable) blocked.push({ id: l.id, reason: 'not publishable (licence)' });
    else if (l.review !== 'published') blocked.push({ id: l.id, reason: `review status is ${l.review}` });
    else ok.push(l);
  }
  return { ok, blocked };
}

/** Auto-mark objective items. Returns marks gained and max. */
export function markQuiz(items: QuizItem[], answers: (number | null)[]): { score: number; max: number; correct: boolean[] } {
  const correct = items.map((it, i) => answers[i] === it.answer);
  return { score: items.reduce((a, it, i) => a + (correct[i] ? it.marks : 0), 0), max: items.reduce((a, it) => a + it.marks, 0), correct };
}
