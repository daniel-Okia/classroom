import { f as fail, r as redirect } from './index2-BPhdCyyv.js';
import { r as resolveJoin, c as createJoinRequest } from './schools-CPeH0e6J.js';
import { a as actorFor } from './auth-BXeAQLLF.js';
import 'node:crypto';
import 'drizzle-orm';
import 'qrcode';
import 'pdfkit';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import './phone-CzGjwkCd.js';

const load = async ({ url, locals }) => {
  if (!locals.user) throw redirect(303, `/login`);
  const code = url.searchParams.get("c");
  const qr = url.searchParams.get("t");
  const target = code || qr ? await resolveJoin({ code: code ?? void 0, qr: qr ?? void 0 }) : null;
  return { target, code, notFound: !!(code || qr) && !target };
};
const actions = {
  lookup: async ({ request }) => {
    const code = String((await request.formData()).get("code") ?? "");
    const t = await resolveJoin({ code });
    if (!t) return fail(404, { error: "We could not find that code. Check it and try again." });
    throw redirect(303, `/join?c=${encodeURIComponent(code)}`);
  },
  request: async ({ request, locals }) => {
    const f = await request.formData();
    const child = String(f.get("child") ?? "").trim();
    if (!child) return fail(400, { error: "Please type your child's name." });
    const t = await resolveJoin({ code: String(f.get("code")) });
    if (!t) return fail(404, { error: "That code is no longer valid." });
    await createJoinRequest(await actorFor(locals.user.id), t, child);
    return { sent: true, school: t.schoolName };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DFNmW4Z0.js')).default;
const server_id = "src/routes/join/+page.server.ts";
const imports = ["_app/immutable/nodes/3.Cs7yEdPH.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/svelte-head.CPwUDVcr.js","_app/immutable/chunks/attributes.RWISXkb6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-abvh2qfg.js.map
