import { am as ensure_array_like } from './index-DLOa9kpw.js';
import { e as escape_html } from './escaping-DWwx1bxi.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    $$renderer2.push(`<h1>Classes and holiday packages</h1> `);
    if (form?.error) {
      $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <section class="card"><h2 style="margin-top:0">Classes</h2> <!--[-->`);
    const each_array = ensure_array_like(data.classes);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let c = each_array[$$index];
      $$renderer2.push(`<p><strong>${escape_html(c.name)}</strong> (${escape_html(c.level)}) · join code <code>${escape_html(c.joinCode)}</code></p>`);
    }
    $$renderer2.push(`<!--]--> <form method="post" action="?/addClass"><label for="cn">Class name</label><input id="cn" name="name" placeholder="S4 East" required=""/> <label for="cl">Level</label><input id="cl" name="level" placeholder="S4" required=""/><button class="primary" style="margin-top:12px">Add class</button></form></section> <section class="card"><h2 style="margin-top:0">Holiday packages</h2> <!--[-->`);
    const each_array_1 = ensure_array_like(data.packages);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let p = each_array_1[$$index_1];
      $$renderer2.push(`<p><strong>${escape_html(p.name)}</strong> · ${escape_html(p.startDate)} to ${escape_html(p.endDate)} · ${escape_html(p.weeklyHourGoal)}h a week · slots ${escape_html(p.slotOptions.join(", "))}</p>`);
    }
    $$renderer2.push(`<!--]--> <form method="post" action="?/addPackage"><label for="pn">Name</label><input id="pn" name="name" placeholder="December Holiday Pack" required=""/> <label for="ps">Start date</label><input id="ps" name="start" type="date" required=""/><label for="pe">End date</label><input id="pe" name="end" type="date" required=""/> <label for="pg">Weekly hour goal</label><input id="pg" name="goal" type="number" min="1" max="14" value="9" required=""/> <label for="pl">Daily start times (comma separated)</label><input id="pl" name="slots" value="09:00, 16:00, 18:00" required=""/> <button class="primary" style="margin-top:12px">Add package</button></form></section>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C0z0A5JG.js.map
