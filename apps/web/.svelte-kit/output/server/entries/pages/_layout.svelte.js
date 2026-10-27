import { e as ensure_array_like, a as attr, s as store_get, u as unsubscribe_stores, d as derived } from "../../chunks/index.js";
import { p as page } from "../../chunks/stores.js";
import { e as escape_html } from "../../chunks/escaping.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, children } = $$props;
    const nav = derived(() => data.roles.includes("guardian") ? [
      ["/", "Home"],
      ["/learn", "Learn"],
      ["/school", "School"],
      ["/messages", "Messages"]
    ] : data.roles.includes("student") ? [
      ["/", "Home"],
      ["/learn", "Library"],
      ["/practice", "Practice"],
      ["/progress", "Progress"]
    ] : data.roles.some((r) => ["teacher", "school_admin", "head_teacher", "bursar"].includes(r)) ? [
      ["/", "Overview"],
      ["/learn", "Library"],
      ["/school", "School"],
      ["/messages", "Messages"]
    ] : []);
    $$renderer2.push(`<a class="skip" href="#main">Skip to content</a> <main id="main">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main> `);
    if (data.user && nav().length) {
      $$renderer2.push(`<!--[0--><nav class="bottom" aria-label="Main"><!--[-->`);
      const each_array = ensure_array_like(nav());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let [href, label] = each_array[$$index];
        $$renderer2.push(`<a${attr("href", href)}${attr("aria-current", store_get($$store_subs ??= {}, "$page", page).url.pathname === href ? "page" : void 0)}>${escape_html(label)}</a>`);
      }
      $$renderer2.push(`<!--]--></nav>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
