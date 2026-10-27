import { f as fail } from './index2-BPhdCyyv.js';
import { a as needActor } from './ctx-BAwda80F.js';
import { r as reportMessage, s as sendMessage, a as readThread } from './hub-CZDImyf3.js';
import { c as childrenOf } from './views-B0LziTLR.js';
import { i as inSchool, m as messageThreads } from './db-4b7EjHA-.js';
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
  const threads = await inSchool(a.schoolId, (tx) => tx.select().from(messageThreads));
  const out = [];
  for (const t of threads) {
    try {
      out.push({ ...t, messages: await readThread(a, t.id) });
    } catch {
    }
  }
  return { threads: out, children: a.roles.includes("guardian") ? await childrenOf(a) : [], me: a.id };
};
const actions = {
  send: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await sendMessage(needActor(locals), { childId: String(f.get("child")), kind: String(f.get("kind")), body: String(f.get("body")), threadId: String(f.get("thread") || "") || void 0 }, String(f.get("key")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
  },
  report: async ({ request, locals }) => {
    await reportMessage(needActor(locals), String((await request.formData()).get("id")));
    return { reported: true };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Ce5gYJBu.js')).default;
const server_id = "src/routes/messages/+page.server.ts";
const imports = ["_app/immutable/nodes/7.Dyo871Di.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/attributes.RWISXkb6.js","_app/immutable/chunks/style.ssG7wXlE.js","_app/immutable/chunks/attributes.BKuqSeVd.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-CzcWqR4I.js.map
