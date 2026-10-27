import { r as redirect, f as fail } from './index2-BPhdCyyv.js';
import { b as registerSchool } from './schools-CPeH0e6J.js';
import { n as normalisePhone } from './phone-CzGjwkCd.js';
import 'node:crypto';
import 'drizzle-orm';
import 'qrcode';
import 'pdfkit';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = ({ locals }) => {
  if (!locals.user) throw redirect(303, "/login");
  return {};
};
const actions = {
  default: async ({ request, locals, cookies }) => {
    if (!locals.user) throw redirect(303, "/login");
    const f = await request.formData();
    const g = (k) => String(f.get(k) ?? "").trim();
    const contact = normalisePhone(g("contact"));
    if (!g("name") || !g("district") || !contact) return fail(400, { error: "Please fill in the school name, district and a valid contact phone.", v: Object.fromEntries(f) });
    const faith = ["full", "light", "off"].includes(g("faith")) ? g("faith") : "light";
    const r = await registerSchool({ name: g("name"), district: g("district"), levelFrom: g("from"), levelTo: g("to"), contactPhone: contact, adminUserId: locals.user.id, faith });
    cookies.set("school", r.schoolId, { path: "/", httpOnly: true, sameSite: "lax" });
    return { done: true, code: r.joinCode };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 15;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B65NA3S8.js')).default;
const server_id = "src/routes/schools/register/+page.server.ts";
const imports = ["_app/immutable/nodes/15.CwfDAmLq.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/svelte-head.CPwUDVcr.js","_app/immutable/chunks/attributes.RWISXkb6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-D7JAydKu.js.map
