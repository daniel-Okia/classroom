import { s as store_get, u as unsubscribe_stores } from "../../chunks/index.js";
import { p as page } from "../../chunks/stores.js";
import { e as escape_html } from "../../chunks/escaping.js";
function Error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<h1>${escape_html(store_get($$store_subs ??= {}, "$page", page).status)}</h1> <p>${escape_html(store_get($$store_subs ??= {}, "$page", page).error?.message)}</p>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  Error as default
};
