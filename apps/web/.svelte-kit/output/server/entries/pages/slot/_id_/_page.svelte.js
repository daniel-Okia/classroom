import { e as ensure_array_like } from "../../../../chunks/index.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    $$renderer2.push(`<h1>Choose your study time</h1> `);
    if (!data.pkg) {
      $$renderer2.push(`<!--[0--><p class="err">We could not find that package.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      if (form?.error) {
        $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form method="post" class="card"><p>Goal: ${escape_html(data.pkg.weeklyHourGoal)} hours a week.</p> <label for="start">Start time</label><select id="start" name="start"><!--[-->`);
      const each_array = ensure_array_like(data.pkg.slotOptions);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let s = each_array[$$index];
        $$renderer2.option({}, s);
      }
      $$renderer2.push(`<!--]--></select> <label for="minutes">How long each day</label><select id="minutes" name="minutes">`);
      $$renderer2.option({ value: "60" }, ($$renderer3) => {
        $$renderer3.push(`1 hour`);
      });
      $$renderer2.option({ value: "90", selected: true }, ($$renderer3) => {
        $$renderer3.push(`1 hour 30 minutes`);
      });
      $$renderer2.option({ value: "120" }, ($$renderer3) => {
        $$renderer3.push(`2 hours`);
      });
      $$renderer2.push(`</select> <button class="primary" style="margin-top:12px">Save my study time</button></form>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
