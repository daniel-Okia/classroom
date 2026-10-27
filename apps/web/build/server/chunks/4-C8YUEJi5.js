import { l as libraryTree } from './library-D9CgKNox.js';
import { n as needUser } from './ctx-BAwda80F.js';
import 'node:path';
import 'drizzle-orm';
import './schools-CPeH0e6J.js';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import './index2-BPhdCyyv.js';

const load = async ({ locals, url }) => {
  needUser(locals);
  const track = url.searchParams.get("track") === "legacy" ? "legacy" : "new";
  return { track, tree: await libraryTree(track) };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BabaU6p4.js')).default;
const server_id = "src/routes/learn/+page.server.ts";
const imports = ["_app/immutable/nodes/4.Bl6QmBRf.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/svelte-head.CPwUDVcr.js","_app/immutable/chunks/attributes.RWISXkb6.js","_app/immutable/chunks/class.ChrbmzR5.js","_app/immutable/chunks/attributes.BKuqSeVd.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-C8YUEJi5.js.map
