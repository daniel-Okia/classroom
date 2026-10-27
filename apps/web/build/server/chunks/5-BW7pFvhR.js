import { e as error } from './index2-BPhdCyyv.js';
import { a as lessonForTopic, v as verseOfTheDay } from './library-D9CgKNox.js';
import { marked } from 'marked';
import katex from 'katex';
import { f as faithFor } from './views-B0LziTLR.js';
import { n as needUser } from './ctx-BAwda80F.js';
import 'node:path';
import 'drizzle-orm';
import './schools-CPeH0e6J.js';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import './schedule-C4Gr4JUv.js';

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

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Bfn2CJ5D.js')).default;
const server_id = "src/routes/learn/[topic]/+page.server.ts";
const imports = ["_app/immutable/nodes/5.BvXy3aiP.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/index-client.Dp9BzwS1.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/svelte-head.CPwUDVcr.js","_app/immutable/chunks/attributes.RWISXkb6.js","_app/immutable/chunks/style.ssG7wXlE.js","_app/immutable/chunks/attributes.BKuqSeVd.js","_app/immutable/chunks/outbox.CjdloonQ.js"];
const stylesheets = ["_app/immutable/assets/5.MYrzCAZg.css"];
const fonts = ["_app/immutable/assets/KaTeX_AMS-Regular.BQhdFMY1.woff2","_app/immutable/assets/KaTeX_AMS-Regular.DMm9YOAa.woff","_app/immutable/assets/KaTeX_AMS-Regular.DRggAlZN.ttf","_app/immutable/assets/KaTeX_Caligraphic-Bold.Dq_IR9rO.woff2","_app/immutable/assets/KaTeX_Caligraphic-Bold.BEiXGLvX.woff","_app/immutable/assets/KaTeX_Caligraphic-Bold.ATXxdsX0.ttf","_app/immutable/assets/KaTeX_Caligraphic-Regular.Di6jR-x-.woff2","_app/immutable/assets/KaTeX_Caligraphic-Regular.CTRA-rTL.woff","_app/immutable/assets/KaTeX_Caligraphic-Regular.wX97UBjC.ttf","_app/immutable/assets/KaTeX_Fraktur-Bold.CL6g_b3V.woff2","_app/immutable/assets/KaTeX_Fraktur-Bold.BsDP51OF.woff","_app/immutable/assets/KaTeX_Fraktur-Bold.BdnERNNW.ttf","_app/immutable/assets/KaTeX_Fraktur-Regular.CTYiF6lA.woff2","_app/immutable/assets/KaTeX_Fraktur-Regular.Dxdc4cR9.woff","_app/immutable/assets/KaTeX_Fraktur-Regular.CB_wures.ttf","_app/immutable/assets/KaTeX_Main-Bold.Cx986IdX.woff2","_app/immutable/assets/KaTeX_Main-Bold.Jm3AIy58.woff","_app/immutable/assets/KaTeX_Main-Bold.waoOVXN0.ttf","_app/immutable/assets/KaTeX_Main-BoldItalic.DxDJ3AOS.woff2","_app/immutable/assets/KaTeX_Main-BoldItalic.SpSLRI95.woff","_app/immutable/assets/KaTeX_Main-BoldItalic.DzxPMmG6.ttf","_app/immutable/assets/KaTeX_Main-Italic.NWA7e6Wa.woff2","_app/immutable/assets/KaTeX_Main-Italic.BMLOBm91.woff","_app/immutable/assets/KaTeX_Main-Italic.3WenGoN9.ttf","_app/immutable/assets/KaTeX_Main-Regular.B22Nviop.woff2","_app/immutable/assets/KaTeX_Main-Regular.Dr94JaBh.woff","_app/immutable/assets/KaTeX_Main-Regular.ypZvNtVU.ttf","_app/immutable/assets/KaTeX_Math-BoldItalic.CZnvNsCZ.woff2","_app/immutable/assets/KaTeX_Math-BoldItalic.iY-2wyZ7.woff","_app/immutable/assets/KaTeX_Math-BoldItalic.B3XSjfu4.ttf","_app/immutable/assets/KaTeX_Math-Italic.t53AETM-.woff2","_app/immutable/assets/KaTeX_Math-Italic.DA0__PXp.woff","_app/immutable/assets/KaTeX_Math-Italic.flOr_0UB.ttf","_app/immutable/assets/KaTeX_SansSerif-Bold.D1sUS0GD.woff2","_app/immutable/assets/KaTeX_SansSerif-Bold.DbIhKOiC.woff","_app/immutable/assets/KaTeX_SansSerif-Bold.CFMepnvq.ttf","_app/immutable/assets/KaTeX_SansSerif-Italic.C3H0VqGB.woff2","_app/immutable/assets/KaTeX_SansSerif-Italic.DN2j7dab.woff","_app/immutable/assets/KaTeX_SansSerif-Italic.YYjJ1zSn.ttf","_app/immutable/assets/KaTeX_SansSerif-Regular.DDBCnlJ7.woff2","_app/immutable/assets/KaTeX_SansSerif-Regular.CS6fqUqJ.woff","_app/immutable/assets/KaTeX_SansSerif-Regular.BNo7hRIc.ttf","_app/immutable/assets/KaTeX_Script-Regular.D3wIWfF6.woff2","_app/immutable/assets/KaTeX_Script-Regular.D5yQViql.woff","_app/immutable/assets/KaTeX_Script-Regular.C5JkGWo-.ttf","_app/immutable/assets/KaTeX_Size1-Regular.mCD8mA8B.woff2","_app/immutable/assets/KaTeX_Size1-Regular.C195tn64.woff","_app/immutable/assets/KaTeX_Size1-Regular.Dbsnue_I.ttf","_app/immutable/assets/KaTeX_Size2-Regular.Dy4dx90m.woff2","_app/immutable/assets/KaTeX_Size2-Regular.oD1tc_U0.woff","_app/immutable/assets/KaTeX_Size2-Regular.B7gKUWhC.ttf","_app/immutable/assets/KaTeX_Size3-Regular.CTq5MqoE.woff","_app/immutable/assets/KaTeX_Size3-Regular.DgpXs0kz.ttf","_app/immutable/assets/KaTeX_Size4-Regular.Dl5lxZxV.woff2","_app/immutable/assets/KaTeX_Size4-Regular.BF-4gkZK.woff","_app/immutable/assets/KaTeX_Size4-Regular.DWFBv043.ttf","_app/immutable/assets/KaTeX_Typewriter-Regular.CO6r4hn1.woff2","_app/immutable/assets/KaTeX_Typewriter-Regular.C0xS9mPB.woff","_app/immutable/assets/KaTeX_Typewriter-Regular.D3Ib7_Hf.ttf"];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-BW7pFvhR.js.map
