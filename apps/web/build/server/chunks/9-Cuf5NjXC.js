import { f as fail } from './index2-BPhdCyyv.js';
import { b as needRole } from './ctx-BAwda80F.js';
import { s as submitAnswer, m as myFeedback, t as tasksForStudent } from './tasks-B1FyclHX.js';
import 'drizzle-orm';
import './schools-CPeH0e6J.js';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = async ({ locals }) => {
  const a = needRole(locals, "student");
  return { tasks: await tasksForStudent(a), feedback: await myFeedback(a, a.id) };
};
const actions = {
  submit: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await submitAnswer(needRole(locals, "student"), String(f.get("task")), String(f.get("text") ?? ""), null, String(f.get("key")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { saved: true };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Cq3To5w3.js')).default;
const server_id = "src/routes/practice/+page.server.ts";
const imports = ["_app/immutable/nodes/9.BiJfTHGO.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/attributes.RWISXkb6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-Cuf5NjXC.js.map
