import { ar as head, an as attr, am as ensure_array_like } from './index-DLOa9kpw.js';
import { e as escape_html } from './escaping-DWwx1bxi.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { form } = $$props;
    const levels = [
      "Nursery",
      "P1",
      "P2",
      "P3",
      "P4",
      "P5",
      "P6",
      "P7",
      "S1",
      "S2",
      "S3",
      "S4",
      "S5",
      "S6"
    ];
    head("1q99pek", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Register your school · Classroom</title>`);
      });
    });
    if (form?.done) {
      $$renderer2.push(`<!--[0--><h1>Thank you</h1> <p class="ok">Your school is registered. A platform admin will verify it, usually within a day. Parents can join once it is verified.</p> <p>Your school code: <strong>${escape_html(form.code)}</strong></p><a class="btn btn-primary" href="/">Continue</a>`);
    } else {
      $$renderer2.push(`<!--[-1--><h1>Register your school</h1> `);
      if (form?.error) {
        $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form method="post" class="card"><label for="name">School name</label><input id="name" name="name"${attr("value", form?.v?.name ?? "")} required=""/> <label for="district">District</label><input id="district" name="district"${attr("value", form?.v?.district ?? "")} required=""/> <label for="from">Lowest class</label><select id="from" name="from"><!--[-->`);
      const each_array = ensure_array_like(levels);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let l = each_array[$$index];
        $$renderer2.option({}, l);
      }
      $$renderer2.push(`<!--]--></select> <label for="to">Highest class</label><select id="to" name="to"><!--[-->`);
      const each_array_1 = ensure_array_like(levels);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let l = each_array_1[i];
        $$renderer2.option({ selected: i === levels.length - 1 }, l);
      }
      $$renderer2.push(`<!--]--></select> <label for="contact">School contact phone</label><input id="contact" name="contact" type="tel"${attr("value", form?.v?.contact ?? "")} required=""/> <label for="faith">Faith content</label> <select id="faith" name="faith">`);
      $$renderer2.option({ value: "light", selected: true }, ($$renderer3) => {
        $$renderer3.push(`Light (verse of the day, opening moment)`);
      });
      $$renderer2.option({ value: "full" }, ($$renderer3) => {
        $$renderer3.push(`Full (adds devotions and reflections)`);
      });
      $$renderer2.option({ value: "off" }, ($$renderer3) => {
        $$renderer3.push(`Off (no faith content)`);
      });
      $$renderer2.push(`</select> <p class="muted">You can change this later. Families can adjust it too.</p> <button class="primary" style="margin-top:12px">Register school</button></form>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B65NA3S8.js.map
