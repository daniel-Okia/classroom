import { am as ensure_array_like, an as attr } from './index-DLOa9kpw.js';
import { e as escape_html } from './escaping-DWwx1bxi.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    $$renderer2.push(`<h1>Families waiting for approval</h1> <p class="muted">Check each name against your school register before approving.</p> `);
    const each_array = ensure_array_like(data.requests);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let r = each_array[$$index];
        $$renderer2.push(`<section class="card"><h2 style="margin:0">${escape_html(r.childName)}</h2> <form method="post" action="?/decide" class="row"><input type="hidden" name="id"${attr("value", r.id)}/> <button class="primary" name="approve" value="1">Approve</button><button class="secondary" name="approve" value="0">Not a pupil here</button></form></section>`);
      }
    } else {
      $$renderer2.push(`<!--[!--><p class="card">No requests waiting.</p>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C5RxtVqS.js.map
