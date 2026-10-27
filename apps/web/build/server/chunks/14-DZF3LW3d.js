import { f as fail } from './index2-BPhdCyyv.js';
import { a as createClass } from './schools-CPeH0e6J.js';
import { c as createPackage } from './study-CLb9I594.js';
import { b as needRole } from './ctx-BAwda80F.js';
import { i as inSchool, h as holidayPackages, a as classes } from './db-4b7EjHA-.js';
import 'node:crypto';
import 'drizzle-orm';
import 'qrcode';
import 'pdfkit';
import './schedule-C4Gr4JUv.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = async ({ locals }) => {
  const a = needRole(locals, "school_admin");
  return inSchool(a.schoolId, async (tx) => ({ classes: await tx.select().from(classes), packages: await tx.select().from(holidayPackages) }));
};
const actions = {
  addClass: async ({ request, locals }) => {
    const f = await request.formData();
    const n = String(f.get("name")).trim(), l = String(f.get("level")).trim();
    if (!n || !l) return fail(400, { error: "Add a class name and level." });
    await createClass(needRole(locals, "school_admin"), n, l);
  },
  addPackage: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await createPackage(needRole(locals, "school_admin"), {
        name: String(f.get("name")),
        startDate: String(f.get("start")),
        endDate: String(f.get("end")),
        weeklyHourGoal: Number(f.get("goal")),
        slotOptions: String(f.get("slots")).split(",").map((s) => s.trim()).filter(Boolean),
        subjectIds: [],
        classIds: []
      });
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

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C0z0A5JG.js')).default;
const server_id = "src/routes/school/setup/+page.server.ts";
const imports = ["_app/immutable/nodes/14.BcHFq3lF.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-DZF3LW3d.js.map
