import { ao as store_get, ap as unsubscribe_stores } from './index-DLOa9kpw.js';
import { p as page } from './stores-BDctgPv9.js';
import { e as escape_html } from './escaping-DWwx1bxi.js';
import './client-fscRgFxv.js';
import './exports-D8haKqit.js';

function Error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<h1>${escape_html(store_get($$store_subs ??= {}, "$page", page).status)}</h1> <p>${escape_html(store_get($$store_subs ??= {}, "$page", page).error?.message)}</p>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { Error as default };
//# sourceMappingURL=error.svelte-DoD6pZOz.js.map
