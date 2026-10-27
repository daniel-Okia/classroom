import { f as fail } from './index2-BPhdCyyv.js';
import { b as needRole } from './ctx-BAwda80F.js';
import { a as markSubmission, b as assignTask, r as reviewQueue } from './tasks-B1FyclHX.js';
import { i as inSchool, u as users } from './db-4b7EjHA-.js';
import 'drizzle-orm';
import './schools-CPeH0e6J.js';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = async ({ locals, params }) => {
  const a = needRole(locals, "teacher", "school_admin", "head_teacher");
  const queue = await reviewQueue(a);
  const names = await inSchool(a.schoolId, (tx) => tx.select({ id: users.id, name: users.name }).from(users));
  return { classId: params.classId, queue: queue.map((q) => ({ ...q, student: names.find((n) => n.id === q.studentId)?.name ?? "Student" })) };
};
const actions = {
  assign: async ({ request, locals, params }) => {
    const f = await request.formData();
    try {
      await assignTask(needRole(locals, "teacher"), { classId: params.classId, title: String(f.get("title")), instructions: String(f.get("instructions")), dueDate: String(f.get("due") || "") || void 0 });
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { assigned: true };
  },
  mark: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await markSubmission(needRole(locals, "teacher"), String(f.get("id")), Number(f.get("score")), Number(f.get("max")), String(f.get("comment") ?? ""));
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

const index = 17;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DT-1l-gO.js')).default;
const server_id = "src/routes/teacher/[classId]/+page.server.ts";
const imports = ["_app/immutable/nodes/17.loal6Vcd.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/attributes.RWISXkb6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-CmVuqWvm.js.map
