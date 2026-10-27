import { ar as head, at as attr_class, an as attr, am as ensure_array_like } from './index-DLOa9kpw.js';
import { e as escape_html } from './escaping-DWwx1bxi.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    head("8s3559", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Library · Classroom</title>`);
      });
    });
    $$renderer2.push(`<h1>Library</h1> <div class="row" role="tablist" aria-label="Curriculum"><a${attr_class(`btn ${data.track === "new" ? "btn-primary" : "btn-secondary"}`)} style="flex:1" href="?track=new"${attr("aria-current", data.track === "new" ? "true" : void 0)}>New curriculum</a> <a${attr_class(`btn ${data.track === "legacy" ? "btn-primary" : "btn-secondary"}`)} style="flex:1" href="?track=legacy"${attr("aria-current", data.track === "legacy" ? "true" : void 0)}>Older syllabus</a></div> `);
    const each_array = ensure_array_like(data.tree);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let n = each_array[$$index_1];
        $$renderer2.push(`<details class="card"${attr("open", n.topics.some((t) => t.hasLesson), true)}><summary><strong>${escape_html(n.level)} · ${escape_html(n.subject)}</strong> <span class="muted">${escape_html(n.topics.filter((t) => t.hasLesson).length)} of ${escape_html(n.topics.length)} topics ready</span></summary> <ul style="padding-left:1.1em"><!--[-->`);
        const each_array_1 = ensure_array_like(n.topics);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let t = each_array_1[$$index];
          $$renderer2.push(`<li>`);
          if (t.hasLesson) {
            $$renderer2.push(`<!--[0--><a${attr("href", `/learn/${t.id}`)}>${escape_html(t.name)}</a>`);
          } else {
            $$renderer2.push(`<!--[-1--><span class="muted">${escape_html(t.name)} · coming soon</span>`);
          }
          $$renderer2.push(`<!--]--></li>`);
        }
        $$renderer2.push(`<!--]--></ul></details>`);
      }
    } else {
      $$renderer2.push(`<!--[!--><p class="card">No content has been loaded yet.</p>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BabaU6p4.js.map
