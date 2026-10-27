import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.CX-FFSIj.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/svelte-head.CPwUDVcr.js","_app/immutable/chunks/forms.cEV9U127.js","_app/immutable/chunks/entry.DD7OQoMf.js","_app/immutable/chunks/index.CADa0VP9.js","_app/immutable/chunks/attributes.RWISXkb6.js","_app/immutable/chunks/class.ChrbmzR5.js","_app/immutable/chunks/attributes.BKuqSeVd.js","_app/immutable/chunks/style.ssG7wXlE.js"];
export const stylesheets = [];
export const fonts = [];
