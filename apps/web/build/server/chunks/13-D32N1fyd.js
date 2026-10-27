import { d as decideJoinRequest, l as listJoinRequests } from './schools-CPeH0e6J.js';
import { b as needRole } from './ctx-BAwda80F.js';
import 'node:crypto';
import 'drizzle-orm';
import 'qrcode';
import 'pdfkit';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import './index2-BPhdCyyv.js';

const load = async ({ locals }) => ({ requests: await listJoinRequests(needRole(locals, "school_admin")) });
const actions = {
  decide: async ({ request, locals }) => {
    const f = await request.formData();
    await decideJoinRequest(needRole(locals, "school_admin"), String(f.get("id")), f.get("approve") === "1");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 13;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C5RxtVqS.js')).default;
const server_id = "src/routes/school/requests/+page.server.ts";
const imports = ["_app/immutable/nodes/13.DAT-0YHg.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/attributes.RWISXkb6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-D32N1fyd.js.map
