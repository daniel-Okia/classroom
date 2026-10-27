import { am as ensure_array_like, an as attr } from './index-DLOa9kpw.js';
import { e as escape_html } from './escaping-DWwx1bxi.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    $$renderer2.push(`<h1>Schools waiting for verification</h1> `);
    const each_array = ensure_array_like(data.schools);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let s = each_array[$$index];
        $$renderer2.push(`<section class="card"><h2 style="margin:0">${escape_html(s.name)}</h2><p>${escape_html(s.district)} · ${escape_html(s.levelFrom)} to ${escape_html(s.levelTo)} · ${escape_html(s.contactPhone)}</p> <p class="muted">Call the school's contact number to confirm before approving.</p> <form method="post" action="?/decide" class="row"><input type="hidden" name="id"${attr("value", s.id)}/> <button class="primary" name="approve" value="1">Approve</button><button class="secondary" name="approve" value="0">Reject</button></form></section>`);
      }
    } else {
      $$renderer2.push(`<!--[!--><p class="card">Nothing waiting.</p>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DLPrj-iw.js.map
