import { f as fail } from './index2-BPhdCyyv.js';
import { a as needActor } from './ctx-BAwda80F.js';
import { u as updateRequest, b as submitRequest, c as rsvp, d as markRead, e as ensureRequestTypes, l as listEvents, m as myRequests, n as noticesForGuardian, f as requestInbox } from './hub-CZDImyf3.js';
import { c as childrenOf } from './views-B0LziTLR.js';
import { c as client } from './db-4b7EjHA-.js';
import 'drizzle-orm';
import './schools-CPeH0e6J.js';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';
import './schedule-C4Gr4JUv.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = async ({ locals }) => {
  const a = needActor(locals);
  const guardian = a.roles.includes("guardian");
  const [s] = await client`select name, district, contact_phone from school where id = ${a.schoolId}`;
  const base = { school: s, events: await listEvents(a), types: await ensureRequestTypes(a.schoolId), guardian };
  if (guardian) return { ...base, notices: await noticesForGuardian(a).catch(() => []), children: await childrenOf(a), mine: await myRequests(a), inbox: [] };
  const canInbox = a.roles.some((r) => ["teacher", "school_admin", "head_teacher", "bursar"].includes(r));
  return { ...base, notices: [], children: [], mine: [], inbox: canInbox ? await requestInbox(a) : [] };
};
const actions = {
  read: async ({ request, locals }) => {
    await markRead(needActor(locals), String((await request.formData()).get("id")));
  },
  rsvp: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await rsvp(needActor(locals), String(f.get("event")), String(f.get("child")), String(f.get("response")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { rsvp: true };
  },
  request: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await submitRequest(needActor(locals), String(f.get("type")), String(f.get("child")), String(f.get("body")), String(f.get("key")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { requested: true };
  },
  status: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await updateRequest(needActor(locals), String(f.get("id")), String(f.get("status")), String(f.get("note") ?? "") || void 0);
    } catch (e) {
      return fail(400, { error: e.message });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 11;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DOmA-0XG.js')).default;
const server_id = "src/routes/school/+page.server.ts";
const imports = ["_app/immutable/nodes/11.BozEWZrj.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/svelte-head.CPwUDVcr.js","_app/immutable/chunks/attributes.RWISXkb6.js","_app/immutable/chunks/class.ChrbmzR5.js","_app/immutable/chunks/attributes.BKuqSeVd.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-ZUj-1Nbc.js.map
