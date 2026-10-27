import { f as fail, r as redirect } from './index2-BPhdCyyv.js';
import { f as faithFor, e as enrolmentFor, w as weekFor, c as childrenOf, o as openPackages, p as pendingJoins, a as classOverview } from './views-B0LziTLR.js';
import { v as verseOfTheDay } from './library-D9CgKNox.js';
import { m as myRequests, n as noticesForGuardian } from './hub-CZDImyf3.js';
import { e as enrolChild } from './study-CLb9I594.js';
import 'drizzle-orm';
import './schedule-C4Gr4JUv.js';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import './ctx-BAwda80F.js';
import 'node:path';
import './schools-CPeH0e6J.js';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';

const load = async ({ locals }) => {
  if (!locals.user) throw redirect(303, "/login");
  const a = locals.actor;
  if (!a?.schoolId) return { mode: a?.roles.includes("platform_admin") ? "platform" : "none" };
  const faith = await faithFor(a.schoolId);
  const doy = Math.floor((Date.now() - Date.UTC((/* @__PURE__ */ new Date()).getUTCFullYear(), 0, 0)) / 864e5);
  const verse = await verseOfTheDay(faith, doy);
  if (a.roles.includes("student")) {
    return { mode: "student", name: locals.user.name, verse, week: await weekFor(a, a.id), enrolment: await enrolmentFor(a, a.id) };
  }
  if (a.roles.includes("guardian")) {
    const kids = await childrenOf(a);
    const children = await Promise.all(kids.map(async (k) => ({ ...k, week: await weekFor(a, k.id), enrolment: await enrolmentFor(a, k.id) })));
    return { mode: "guardian", verse, children, notices: (await noticesForGuardian(a).catch(() => [])).slice(0, 4), requests: (await myRequests(a)).slice(0, 3), packages: await openPackages(a) };
  }
  const isAdmin = a.roles.includes("school_admin");
  return { mode: "staff", classes: await classOverview(a), pending: isAdmin ? (await pendingJoins(a)).length : 0, isAdmin };
};
const actions = {
  studyAs: async ({ request, cookies }) => {
    const id = String((await request.formData()).get("child"));
    cookies.set("as", id, { path: "/", httpOnly: true, sameSite: "lax" });
    throw redirect(303, "/");
  },
  exitChild: async ({ cookies }) => {
    cookies.delete("as", { path: "/" });
    throw redirect(303, "/");
  },
  enrol: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await enrolChild(locals.actor, String(f.get("pkg")), String(f.get("child")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { enrolled: true };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B6ueL54N.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/2.BWjxuGtN.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/svelte-head.CPwUDVcr.js","_app/immutable/chunks/forms.kosobeJI.js","_app/immutable/chunks/entry.BQ4mZNaJ.js","_app/immutable/chunks/index.CADa0VP9.js","_app/immutable/chunks/attributes.RWISXkb6.js","_app/immutable/chunks/class.ChrbmzR5.js","_app/immutable/chunks/attributes.BKuqSeVd.js","_app/immutable/chunks/style.ssG7wXlE.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-YrPWHGgs.js.map
