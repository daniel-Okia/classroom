import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { join } from 'node:path';
process.env.CONTENT_DIR = join(__dirname, '../../../../../content');
import { client } from './db';
import { loadContent, libraryTree, lessonForTopic, submitQuiz, seedDevotions, verseOfTheDay } from './library';
import { seedSchool } from './testkit';

afterAll(() => client.end());
beforeAll(async () => { await loadContent(false); await seedDevotions(); });

describe('library', () => {
  it('loads idempotently and exposes both tracks separately', async () => {
    const again = await loadContent(false); expect(again.loaded).toBe(0);
    const t = await libraryTree();
    expect(new Set(t.map((n) => n.track))).toEqual(new Set(['new', 'legacy']));
    expect((await libraryTree('legacy')).every((n) => n.track === 'legacy')).toBe(true);
    const math = t.find((n) => n.track === 'new' && n.level === 'S1' && n.subject === 'Mathematics')!;
    expect(math.topics).toHaveLength(14);
    expect(math.topics.filter((x) => x.hasLesson)).toHaveLength(1);
  });
  it('production load blocks unreviewed drafts', async () => { expect((await loadContent(true)).blocked).toHaveLength(4); });

  it('lesson payload hides the answer key, quiz marks server-side and idempotently', async () => {
    const t = (await libraryTree()).find((n) => n.level === 'S1' && n.subject === 'Mathematics')!;
    const topic = t.topics.find((x) => x.hasLesson)!;
    const l = (await lessonForTopic(topic.id))!;
    expect(JSON.stringify(l.items)).not.toContain('answer'); expect(JSON.stringify(l.items)).not.toContain('explain');
    const s = await seedSchool();
    const r1 = await submitQuiz(s.child, l.quizId!, [0, 1, 2, 1], 'att-1');
    expect(r1.score).toBe(4); expect(r1.max).toBe(4);
    const r2 = await submitQuiz(s.child, l.quizId!, [3, 3, 3, 3], 'att-1');   // retried offline submission with same key
    expect(r2.score).toBe(4);
    expect((await submitQuiz(s.child, l.quizId!, [null, null, null, null], 'att-2')).score).toBe(0);
    await expect(submitQuiz(s.child, l.quizId!, [0], 'att-3')).rejects.toThrow();
    const other = await seedSchool();
    expect((await submitQuiz(other.child, l.quizId!, [0, 0, 0, 0], 'att-1')).score).toBe(1);   // same key in another school is independent
  });

  it('verse follows the faith setting and review status', async () => {
    delete process.env.ALLOW_DRAFT_DEVOTIONS;
    expect(await verseOfTheDay('full', 1)).toBeNull();               // drafts are not served
    process.env.ALLOW_DRAFT_DEVOTIONS = '1';
    expect(await verseOfTheDay('off', 1)).toBeNull();
    expect(Object.keys((await verseOfTheDay('light', 1))!)).toEqual(['reference']);
    expect((await verseOfTheDay('full', 1) as any).reflection).toBeTruthy();
  });
});
