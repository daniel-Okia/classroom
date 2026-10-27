import { a as needActor } from './ctx-BAwda80F.js';
import { c as childrenOf, w as weekFor } from './views-B0LziTLR.js';
import { F as Forbidden } from './schools-CPeH0e6J.js';
import './index2-BPhdCyyv.js';
import 'drizzle-orm';
import './schedule-C4Gr4JUv.js';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';

const load = async ({ locals, url }) => {
  const a = needActor(locals);
  const want = url.searchParams.get("child") ?? a.id;
  if (want !== a.id) {
    const kids = await childrenOf(a);
    if (!kids.some((k) => k.id === want)) throw new Forbidden();
  }
  return { week: await weekFor(a, want) };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 10;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-ClnwhJPM.js')).default;
const server_id = "src/routes/progress/+page.server.ts";
const imports = ["_app/immutable/nodes/10.CNcmH3so.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/class.ChrbmzR5.js","_app/immutable/chunks/attributes.BKuqSeVd.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-BMNqObns.js.map
