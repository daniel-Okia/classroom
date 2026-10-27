import { e as ensure_array_like, a as attr } from "../../../chunks/index.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const k = () => crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
    $$renderer2.push(`<h1>Practice</h1> `);
    if (form?.error) {
      $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if (form?.saved) {
      $$renderer2.push(`<!--[0--><p class="ok">Sent to your teacher. They will review it.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    const each_array = ensure_array_like(data.tasks);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let t = each_array[$$index];
        $$renderer2.push(`<section class="card"><h2 style="margin-top:0">${escape_html(t.title)}</h2><p style="white-space:pre-wrap">${escape_html(t.instructions)}</p> <form method="post" action="?/submit"><input type="hidden" name="task"${attr("value", t.id)}/><input type="hidden" name="key"${attr("value", k())}/> <label${attr("for", `a${t.id}`)}>Type your working here</label><textarea${attr("id", `a${t.id}`)} name="text" rows="5"></textarea> <button class="primary" style="margin-top:8px">Submit answer</button></form></section>`);
      }
    } else {
      $$renderer2.push(`<!--[!--><p class="card">No tasks right now.</p>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (data.feedback.length) {
      $$renderer2.push(`<!--[0--><h2>Teacher feedback</h2><!--[-->`);
      const each_array_1 = ensure_array_like(data.feedback);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let f = each_array_1[$$index_1];
        $$renderer2.push(`<div class="card"><strong>${escape_html(f.title)}</strong> · ${escape_html(f.score)}/${escape_html(f.max)}<p>${escape_html(f.comment)}</p></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
