import { an as attr, am as ensure_array_like, au as attr_style } from './index-DLOa9kpw.js';
import { e as escape_html } from './escaping-DWwx1bxi.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const k = () => crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
    $$renderer2.push(`<h1>Messages</h1> <p class="muted">Messages are visible to the school's administration to keep everyone safe.</p> `);
    if (form?.error) {
      $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if (form?.reported) {
      $$renderer2.push(`<!--[0--><p class="ok">Thank you. The school has been told.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.children.length) {
      $$renderer2.push(`<!--[0--><form method="post" action="?/send" class="card"><input type="hidden" name="key"${attr("value", k())}/> <label for="mc">About which child?</label><select id="mc" name="child"><!--[-->`);
      const each_array = ensure_array_like(data.children);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let c = each_array[$$index];
        $$renderer2.option({ value: c.id }, ($$renderer3) => {
          $$renderer3.push(`${escape_html(c.name)}`);
        });
      }
      $$renderer2.push(`<!--]--></select> <label for="mk">To</label><select id="mk" name="kind">`);
      $$renderer2.option({ value: "parent_teacher" }, ($$renderer3) => {
        $$renderer3.push(`Class teacher`);
      });
      $$renderer2.option({ value: "parent_office" }, ($$renderer3) => {
        $$renderer3.push(`School office`);
      });
      $$renderer2.push(`</select> <label for="mb">Message</label><textarea id="mb" name="body" rows="3" required=""></textarea><button class="primary" style="margin-top:8px">Send</button></form>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    const each_array_1 = ensure_array_like(data.threads);
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
        let t = each_array_1[$$index_2];
        $$renderer2.push(`<section class="card"><span class="pill">${escape_html(t.kind === "parent_teacher" ? "Teacher" : "Office")}</span> <!--[-->`);
        const each_array_2 = ensure_array_like(t.messages);
        for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
          let m = each_array_2[$$index_1];
          $$renderer2.push(`<div${attr_style(m.senderId === data.me ? "text-align:right" : "")}>${escape_html(m.body)} <form method="post" action="?/report" style="display:inline"><input type="hidden" name="id"${attr("value", m.id)}/><button class="secondary" style="min-height:32px;padding:0 10px;font-size:.8rem">Report</button></form></div>`);
        }
        $$renderer2.push(`<!--]--> <form method="post" action="?/send"><input type="hidden" name="key"${attr("value", k())}/><input type="hidden" name="thread"${attr("value", t.id)}/><input type="hidden" name="child"${attr("value", t.childId)}/><input type="hidden" name="kind"${attr("value", t.kind)}/> <label${attr("for", `r${t.id}`)}>Reply</label><input${attr("id", `r${t.id}`)} name="body" required=""/><button class="primary" style="margin-top:8px">Send reply</button></form></section>`);
      }
    } else {
      $$renderer2.push(`<!--[!--><p class="card">No messages yet.</p>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Ce5gYJBu.js.map
