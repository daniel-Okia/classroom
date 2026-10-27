import { r as redirect, e as error } from './index2-BPhdCyyv.js';
import { v as verifySchool, p as pendingSchools } from './schools-CPeH0e6J.js';
import 'node:crypto';
import 'drizzle-orm';
import 'qrcode';
import 'pdfkit';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = async ({ locals }) => {
  if (!locals.user) throw redirect(303, "/login");
  if (!locals.actor?.roles.includes("platform_admin")) throw error(403, "Not allowed");
  return { schools: await pendingSchools() };
};
const actions = {
  decide: async ({ request, locals }) => {
    const f = await request.formData();
    await verifySchool(locals.actor, String(f.get("id")), f.get("approve") === "1");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DLPrj-iw.js')).default;
const server_id = "src/routes/platform/+page.server.ts";
const imports = ["_app/immutable/nodes/8.DrUa1lmS.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/attributes.RWISXkb6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-DQl3xII_.js.map
