import { f as fail, r as redirect } from './index2-BPhdCyyv.js';
import { v as verifyOtp, A as AuthError, r as requestOtp } from './auth-BXeAQLLF.js';
import 'node:crypto';
import 'drizzle-orm';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import './phone-CzGjwkCd.js';

const hits = /* @__PURE__ */ new Map();
const limited = (ip) => {
  const now = Date.now();
  const a = (hits.get(ip) ?? []).filter((t) => now - t < 6e5);
  a.push(now);
  hits.set(ip, a);
  return a.length > 20;
};
const actions = {
  send: async ({ request, getClientAddress }) => {
    const f = await request.formData();
    const phone = String(f.get("phone") ?? "");
    if (limited(getClientAddress())) return fail(429, { phone, error: "Too many attempts. Please wait a few minutes." });
    try {
      await requestOtp(phone);
    } catch (e) {
      if (e instanceof AuthError) return fail(400, { phone, error: e.message });
      throw e;
    }
    return { phone, sent: true };
  },
  verify: async ({ request, cookies, getClientAddress }) => {
    const f = await request.formData();
    const phone = String(f.get("phone") ?? "");
    const code = String(f.get("code") ?? "");
    const name = String(f.get("name") ?? "");
    if (limited(getClientAddress())) return fail(429, { phone, sent: true, error: "Too many attempts. Please wait a few minutes." });
    try {
      const r = await verifyOtp(phone, code, name);
      cookies.set("sid", r.token, { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 30 * 86400 });
    } catch (e) {
      if (e instanceof AuthError) return fail(400, { phone, sent: true, error: e.message });
      throw e;
    }
    throw redirect(303, "/");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DNHojZ6P.js')).default;
const server_id = "src/routes/login/+page.server.ts";
const imports = ["_app/immutable/nodes/6.doo9l4n1.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/svelte-head.CPwUDVcr.js","_app/immutable/chunks/forms.kosobeJI.js","_app/immutable/chunks/entry.BQ4mZNaJ.js","_app/immutable/chunks/index.CADa0VP9.js","_app/immutable/chunks/attributes.RWISXkb6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-3EJ9cKbw.js.map
