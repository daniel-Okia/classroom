import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseLesson, releaseGate, markQuiz } from './index';

const dir = join(__dirname, '../../../content/lessons');
const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
const lessons = files.map((f) => parseLesson(f, readFileSync(join(dir, f), 'utf8')));

describe('seed lessons', () => {
  it('there are 4 lessons covering 2 subjects x 2 levels', () => {
    expect(lessons).toHaveLength(4);
    expect(new Set(lessons.map((l) => l.level))).toEqual(new Set(['S1', 'P4']));
    expect(new Set(lessons.map((l) => l.subject.replace('integrated-science', 'biology'))).size).toBe(2);
  });
  it('each has a 4 item quiz with a correct answer in range', () => lessons.forEach((l) => expect(l.quiz).toHaveLength(4)));
  it('every topic exists in the taxonomy', () => {
    const tx = JSON.parse(readFileSync(join(dir, '../taxonomy/taxonomy.json'), 'utf8'));
    for (const l of lessons) {
      const lvl = tx.tracks.find((t: any) => t.track === l.track).levels.find((x: any) => x.code === l.level);
      const subj = lvl.subjects.find((s: any) => s.code === l.subject);
      expect(subj.topics.map((t: string) => t.toLowerCase()), l.id).toContain(l.topic.toLowerCase());
    }
  });
  it('production release gate blocks drafts', () => {
    expect(releaseGate(lessons, true).ok).toHaveLength(0);
    expect(releaseGate(lessons, false).ok).toHaveLength(4);
    expect(releaseGate([{ ...lessons[0]!, review: 'published' }], true).ok).toHaveLength(1);
    expect(releaseGate([{ ...lessons[0]!, review: 'published', publishable: false }], true).blocked).toHaveLength(1);
  });
});

describe('parser', () => {
  const ok = `---\nid: a\ntrack: new\nlevel: S1\nsubject: m\ntopic: t\ntitle: T\nauthor: x\nreview: draft\nsource: s\nlicence: l\npublishable: true\n---\n## Key idea\na\n## Worked example\nb\n## Practice\nc\n## Check yourself\nd`;
  it('accepts a minimal lesson', () => expect(parseLesson('x', ok).quiz).toEqual([]));
  it('rejects missing sections, wrong order, bad quiz', () => {
    expect(() => parseLesson('x', ok.replace('## Practice\nc\n', ''))).toThrow('Practice');
    expect(() => parseLesson('x', ok.replace('## Key idea\na\n## Worked example\nb', '## Worked example\nb\n## Key idea\na'))).toThrow('order');
    expect(() => parseLesson('x', ok + '\n```quiz\n[{"q":"?","options":["a","b"],"answer":5,"explain":"e","marks":1}]\n```')).toThrow('out of range');
    expect(() => parseLesson('x', ok.replace('licence: l\n', ''))).toThrow('licence');
  });
  it('marks objective items', () => {
    const items = [{ q: '', options: ['a', 'b'], answer: 1, explain: 'e', marks: 2 }, { q: '', options: ['a', 'b'], answer: 0, explain: 'e', marks: 1 }];
    expect(markQuiz(items, [1, 1])).toEqual({ score: 2, max: 3, correct: [true, false] });
    expect(markQuiz(items, [null, null]).score).toBe(0);
  });
});
