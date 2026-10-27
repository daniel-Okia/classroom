import { marked } from 'marked';
import katex from 'katex';

/**
 * Markdown + KaTeX to HTML, on the server so phones receive plain HTML (no JS maths engine).
 * Raw HTML in the source is escaped, so lesson text cannot inject markup or script.
 */
export function renderLesson(md: string): string {
  const maths: string[] = [];
  const stash = (tex: string, display: boolean) => { maths.push(katex.renderToString(tex, { displayMode: display, throwOnError: false, output: 'htmlAndMathml', trust: false })); return `@@M${maths.length - 1}@@`; };
  const escaped = md.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const withMath = escaped.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => stash(t, true)).replace(/\$([^$\n]+?)\$/g, (_, t) => stash(t.replace(/&lt;/g, '<').replace(/&amp;/g, '&'), false));
  const html = marked.parse(withMath, { async: false, gfm: true }) as string;
  return html.replace(/@@M(\d+)@@/g, (_, i) => maths[Number(i)]!);
}
