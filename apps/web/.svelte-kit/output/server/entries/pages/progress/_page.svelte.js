import { e as ensure_array_like, c as attr_class, d as derived } from "../../../chunks/index.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const w = derived(() => data.week);
    $$renderer2.push(`<h1>Progress</h1> <section class="card"><strong>Study days</strong> <div class="dots"><!--[-->`);
    const each_array = ensure_array_like(w().days);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let d = each_array[i];
      $$renderer2.push(`<span${attr_class("", void 0, { "on": d })}>${escape_html(d ? "✓" : "MTWTFSS"[i])}</span>`);
    }
    $$renderer2.push(`<!--]--></div> <p>${escape_html(Math.floor(w().minutes / 60))}h ${escape_html(w().minutes % 60)}m of ${escape_html(w().goalHours)}h goal</p></section> <section class="card"><strong>Quiz scores</strong> `);
    const each_array_1 = ensure_array_like(w().scores);
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let s = each_array_1[$$index_1];
        $$renderer2.push(`<div class="row"><span>${escape_html(s.topic)}</span><span>${escape_html(Math.round(s.score / s.max * 100))}%</span></div>`);
      }
    } else {
      $$renderer2.push(`<!--[!--><p class="muted">No quizzes taken yet.</p>`);
    }
    $$renderer2.push(`<!--]--></section> <p class="muted">Frequently tested topics will appear here when teachers add them. Frequently tested, not a prediction.</p>`);
  });
}
export {
  _page as default
};
