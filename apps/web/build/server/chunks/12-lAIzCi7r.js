import { f as fail } from './index2-BPhdCyyv.js';
import { a as needActor } from './ctx-BAwda80F.js';
import { g as createEvent, p as postNotice } from './hub-CZDImyf3.js';
import 'drizzle-orm';
import './schools-CPeH0e6J.js';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const actions = {
  notice: async ({ request, locals }) => {
    const f = await request.formData();
    const kind = String(f.get("audience"));
    const audience = kind === "level" ? { kind: "level", level: String(f.get("level")) } : kind === "class" ? { kind: "class", classId: String(f.get("classId")) } : { kind: "school" };
    try {
      await postNotice(needActor(locals), { title: String(f.get("title")), body: String(f.get("body")), priority: String(f.get("priority")), audience, verse: String(f.get("verse") || "") || void 0 });
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { posted: true };
  },
  event: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await createEvent(needActor(locals), { title: String(f.get("title")), kind: String(f.get("kind")), startsAt: new Date(String(f.get("starts"))), rsvpDeadline: f.get("deadline") ? new Date(String(f.get("deadline"))) : void 0, needsConsent: f.get("consent") === "on" });
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { eventPosted: true };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

const index = 12;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Cir4EXBr.js')).default;
const server_id = "src/routes/school/notices/+page.server.ts";
const imports = ["_app/immutable/nodes/12.CDZgujWM.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-lAIzCi7r.js.map
