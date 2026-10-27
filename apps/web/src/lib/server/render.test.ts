import { describe, it, expect } from 'vitest';
import { renderLesson } from './render';
describe('renderLesson', () => {
  it('renders inline maths and markdown', () => {
    const h = renderLesson('## Key idea\nUse $x^2 - 5x + 6 = 0$ and **bold**.');
    expect(h).toContain('<h2>Key idea</h2>'); expect(h).toContain('katex'); expect(h).toContain('<strong>bold</strong>');
  });
  it('escapes raw HTML and scripts', () => {
    const h = renderLesson('<script>alert(1)</script> <img src=x onerror=alert(1)>');
    expect(h).not.toContain('<script'); expect(h).not.toContain('<img');
  });
  it('does not treat a lone dollar price as maths', () => { expect(renderLesson('It costs 5 dollars')).toContain('5 dollars'); });
  it('survives bad LaTeX', () => { expect(() => renderLesson('$\\frac{1$')).not.toThrow(); });
});
