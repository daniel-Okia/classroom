import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { form } = $$props;
    $$renderer2.push(`<h1>Post to families</h1> `);
    if (form?.error) {
      $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if (form?.posted) {
      $$renderer2.push(`<!--[0--><p class="ok">Notice posted.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if (form?.eventPosted) {
      $$renderer2.push(`<!--[0--><p class="ok">Event added.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="post" action="?/notice" class="card"><h2 style="margin-top:0">Notice</h2> <label for="nt">Title</label><input id="nt" name="title" required=""/><label for="nb">Message</label><textarea id="nb" name="body" rows="4" required=""></textarea> <label for="np">Priority</label><select id="np" name="priority">`);
    $$renderer2.option({ value: "normal" }, ($$renderer3) => {
      $$renderer3.push(`Normal`);
    });
    $$renderer2.option({ value: "important" }, ($$renderer3) => {
      $$renderer3.push(`Important`);
    });
    $$renderer2.option({ value: "emergency" }, ($$renderer3) => {
      $$renderer3.push(`Emergency (ignores quiet hours)`);
    });
    $$renderer2.push(`</select> <label for="na">Send to</label><select id="na" name="audience">`);
    $$renderer2.option({ value: "school" }, ($$renderer3) => {
      $$renderer3.push(`Whole school`);
    });
    $$renderer2.option({ value: "level" }, ($$renderer3) => {
      $$renderer3.push(`One level`);
    });
    $$renderer2.push(`</select> <label for="nl">Level (if one level)</label><input id="nl" name="level" placeholder="S4"/> <label for="nv">School verse (optional)</label><input id="nv" name="verse"/><button class="primary" style="margin-top:12px">Post notice</button></form> <form method="post" action="?/event" class="card"><h2 style="margin-top:0">Event</h2> <label for="et">Title</label><input id="et" name="title" required=""/><label for="ek">Type</label><select id="ek" name="kind">`);
    $$renderer2.option({}, ($$renderer3) => {
      $$renderer3.push(`meeting`);
    });
    $$renderer2.option({}, ($$renderer3) => {
      $$renderer3.push(`trip`);
    });
    $$renderer2.option({}, ($$renderer3) => {
      $$renderer3.push(`exam`);
    });
    $$renderer2.option({}, ($$renderer3) => {
      $$renderer3.push(`holiday`);
    });
    $$renderer2.option({}, ($$renderer3) => {
      $$renderer3.push(`sports`);
    });
    $$renderer2.push(`</select> <label for="es">Starts</label><input id="es" name="starts" type="datetime-local" required=""/><label for="ed">Reply by (optional)</label><input id="ed" name="deadline" type="datetime-local"/> <label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="checkbox" name="consent" style="width:24px;min-height:24px"/> Needs parent permission</label> <button class="primary" style="margin-top:12px">Add event</button></form>`);
  });
}
export {
  _page as default
};
