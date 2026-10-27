import { e as error } from "../../../../chunks/index2.js";
import { a as lessonForTopic, v as verseOfTheDay } from "../../../../chunks/library.js";
import { marked } from "marked";
import katex from "katex";
import { f as faithFor } from "../../../../chunks/views.js";
import { n as needUser } from "../../../../chunks/ctx.js";
function renderLesson(md) {
  const maths = [];
  const stash = (tex, display) => {
    maths.push(katex.renderToString(tex, { displayMode: display, throwOnError: false, output: "htmlAndMathml", trust: false }));
    return `@@M${maths.length - 1}@@`;
  };
  const escaped = md.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const withMath = escaped.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => stash(t, true)).replace(/\$([^$\n]+?)\$/g, (_, t) => stash(t.replace(/&lt;/g, "<").replace(/&amp;/g, "&"), false));
  const html = marked.parse(withMath, { async: false, gfm: true });
  return html.replace(/@@M(\d+)@@/g, (_, i) => maths[Number(i)]);
}
const PRAYERS = ["Lord, thank you for this time to learn. Help me to work with a calm mind and an honest heart. Amen.", "God, open my mind and help me to understand. Amen.", "Thank you, Father, for teachers, family and friends who help me learn. Amen."];
const load = async ({ params, locals }) => {
  needUser(locals);
  const l = await lessonForTopic(params.topic);
  if (!l) throw error(404, "This lesson is not ready yet");
  const sections = l.lesson.bodyMd.split(/^## /m).filter(Boolean).map((s) => {
    const [title, ...rest] = s.split("\n");
    return { title: title.trim(), html: renderLesson(rest.join("\n")) };
  });
  const a = locals.actor;
  const faith = a?.schoolId ? await faithFor(a.schoolId) : "light";
  const doy = Math.floor((Date.now() - Date.UTC((/* @__PURE__ */ new Date()).getUTCFullYear(), 0, 0)) / 864e5);
  return {
    title: l.lesson.title,
    sections,
    items: l.items,
    quizId: l.quizId,
    faith,
    canSubmit: !!a?.roles.includes("student"),
    opening: faith === "off" ? null : { prayer: PRAYERS[doy % PRAYERS.length], verse: await verseOfTheDay(faith, doy) }
  };
};
export {
  load
};
