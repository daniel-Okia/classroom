import { e as ensure_array_like, a as attr } from "../../../../chunks/index.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    $$renderer2.push(`<h1>Tasks and marking</h1> `);
    if (form?.error) {
      $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if (form?.assigned) {
      $$renderer2.push(`<!--[0--><p class="ok">Task assigned.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="post" action="?/assign" class="card"><h2 style="margin-top:0">Assign a task</h2> <label for="t">Title</label><input id="t" name="title" required=""/><label for="i">Instructions</label><textarea id="i" name="instructions" rows="4" required=""></textarea> <label for="d">Due date (optional)</label><input id="d" name="due" type="date"/><button class="primary" style="margin-top:12px">Assign to class</button></form> <h2>To review</h2> `);
    const each_array = ensure_array_like(data.queue);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let q = each_array[$$index];
        $$renderer2.push(`<section class="card"><div class="row"><strong>${escape_html(q.student)}</strong><span class="muted">${escape_html(q.taskTitle)}</span></div> <p style="white-space:pre-wrap">${escape_html(q.text ?? "(photo answer)")}</p> `);
        if (q.markId) {
          $$renderer2.push(`<!--[0--><p class="pill">Marked</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <form method="post" action="?/mark"><input type="hidden" name="id"${attr("value", q.id)}/> <div class="row"><div style="flex:1"><label${attr("for", `s${q.id}`)}>Score</label><input${attr("id", `s${q.id}`)} name="score" type="number" min="0" required=""/></div> <div style="flex:1"><label${attr("for", `m${q.id}`)}>Out of</label><input${attr("id", `m${q.id}`)} name="max" type="number" min="1" value="4" required=""/></div></div> <label${attr("for", `c${q.id}`)}>Comment</label><textarea${attr("id", `c${q.id}`)} name="comment" rows="2"></textarea> <button class="primary" style="margin-top:8px">${escape_html(q.markId ? "Update mark" : "Save mark")}</button></form></section>`);
      }
    } else {
      $$renderer2.push(`<!--[!--><p class="card">Nothing to review yet.</p>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
