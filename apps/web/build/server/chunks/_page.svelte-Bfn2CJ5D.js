import { ar as head, au as attr_style, am as ensure_array_like, an as attr, P as derived } from './index-DLOa9kpw.js';
import { e as escape_html } from './escaping-DWwx1bxi.js';

function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const key = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const steps = derived(() => [
      ...data.opening ? ["open"] : [],
      "notes",
      "practice",
      "check",
      "done"
    ]);
    let step = 0;
    let answers = data.items.map(() => null);
    let seconds = 0;
    key();
    key();
    const notes = derived(() => data.sections.filter((s) => s.title === "Key idea" || s.title === "Worked example"));
    const practice = derived(() => data.sections.find((s) => s.title === "Practice"));
    const checklist = derived(() => data.sections.find((s) => s.title === "Check yourself"));
    const mins = derived(() => Math.floor(seconds / 60));
    head("10400zp", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.title)} · Classroom</title>`);
      });
    });
    $$renderer2.push(`<h1>${escape_html(data.title)}</h1> <div class="bar" aria-hidden="true"><i${attr_style(`width:${step / (steps().length - 1) * 100}%`)}></i></div> `);
    if (steps()[step] === "open") {
      $$renderer2.push(`<!--[0--><section class="card" aria-label="Opening moment"><h2 style="margin-top:0">A quiet moment</h2> `);
      if (data.opening.verse) {
        $$renderer2.push(`<!--[0--><p><strong>${escape_html(data.opening.verse.reference)}</strong></p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <p>${escape_html(data.opening.prayer)}</p> <button class="primary">Begin</button></section>`);
    } else if (steps()[step] === "notes") {
      $$renderer2.push(`<!--[1--><!--[-->`);
      const each_array = ensure_array_like(notes());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let s = each_array[$$index];
        $$renderer2.push(`<section class="card"><h2 style="margin-top:0">${escape_html(s.title)}</h2>${html(s.html)}</section>`);
      }
      $$renderer2.push(`<!--]--> <button class="primary">Now practise</button>`);
    } else if (steps()[step] === "practice") {
      $$renderer2.push("<!--[2-->");
      if (practice()) {
        $$renderer2.push(`<!--[0--><section class="card"><h2 style="margin-top:0">${escape_html(practice().title)}</h2>${html(practice().html)}</section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (checklist()) {
        $$renderer2.push(`<!--[0--><section class="card"><h2 style="margin-top:0">${escape_html(checklist().title)}</h2>${html(checklist().html)}</section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button class="primary">${escape_html(data.items.length ? "Take the quiz" : "Finish")}</button>`);
    } else if (steps()[step] === "check") {
      $$renderer2.push("<!--[3-->");
      if (!data.canSubmit) {
        $$renderer2.push(`<!--[0--><p class="ok">You are previewing as an adult. Tap "Study as" on the Home screen to take the quiz as your child.</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form><!--[-->`);
      const each_array_1 = ensure_array_like(data.items);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let it = each_array_1[i];
        $$renderer2.push(`<fieldset class="card"><legend><strong>${escape_html(i + 1)}. ${escape_html(it.q)}</strong></legend> <!--[-->`);
        const each_array_2 = ensure_array_like(it.options);
        for (let j = 0, $$length2 = each_array_2.length; j < $$length2; j++) {
          let o = each_array_2[j];
          $$renderer2.push(`<label style="font-weight:400;display:flex;gap:10px;align-items:center;min-height:44px"><input type="radio" style="width:24px;min-height:24px"${attr("name", `q${i}`)}${attr("value", j)}${attr("checked", answers[i] === j, true)}/> ${escape_html(o)}</label>`);
        }
        $$renderer2.push(`<!--]--></fieldset>`);
      }
      $$renderer2.push(`<!--]--> <button class="primary"${attr("disabled", !data.canSubmit, true)}>Submit my answers</button></form>`);
    } else {
      $$renderer2.push(`<!--[-1--><section class="card" aria-live="polite">`);
      {
        $$renderer2.push(`<!--[-1--><h2 style="margin-top:0">Well done</h2>`);
      }
      $$renderer2.push(`<!--]--> <p class="muted">Active study time today in this lesson: ${escape_html(mins())} min.</p> `);
      if (data.canSubmit && true) {
        $$renderer2.push(`<!--[0--><button class="primary">I studied today: check in</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <p><a class="btn btn-secondary" href="/learn">Back to library</a></p></section>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Bfn2CJ5D.js.map
