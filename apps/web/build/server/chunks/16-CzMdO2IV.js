import { f as fail, r as redirect } from './index2-BPhdCyyv.js';
import { a as needActor } from './ctx-BAwda80F.js';
import { a as chooseSlot } from './study-CLb9I594.js';
import { i as inSchool, b as packageEnrolments, h as holidayPackages } from './db-4b7EjHA-.js';
import { eq } from 'drizzle-orm';
import './schools-CPeH0e6J.js';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';
import './schedule-C4Gr4JUv.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = async ({ locals, params }) => {
  const a = needActor(locals);
  return inSchool(a.schoolId, async (tx) => {
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.id, params.id));
    const [p] = e ? await tx.select().from(holidayPackages).where(eq(holidayPackages.id, e.packageId)) : [];
    return { pkg: p ?? null };
  });
};
const actions = {
  default: async ({ request, locals, params }) => {
    const f = await request.formData();
    try {
      await chooseSlot(needActor(locals), params.id, String(f.get("start")), Number(f.get("minutes")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
    throw redirect(303, "/");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CwZMN7aX.js')).default;
const server_id = "src/routes/slot/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/16.uz-a9qWk.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-CzMdO2IV.js.map
