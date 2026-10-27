const csr = true;

var _layout_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  csr: csr
});

const load = async ({ locals, url }) => ({ user: locals.user, roles: locals.actor?.roles ?? [], hasSchool: !!locals.actor?.schoolId, path: url.pathname });

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-CY5HTvIL.js')).default;
const universal_id = "src/routes/+layout.ts";
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.50Pn9bLY.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/index-client.Dp9BzwS1.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/attributes.RWISXkb6.js","_app/immutable/chunks/store.BoIo8Emr.js","_app/immutable/chunks/index.CADa0VP9.js","_app/immutable/chunks/stores.DxtNiYF8.js","_app/immutable/chunks/entry.BQ4mZNaJ.js","_app/immutable/chunks/outbox.CjdloonQ.js"];
const stylesheets = ["_app/immutable/assets/0.DO_7VHJG.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=0-BonSmr4Z.js.map
