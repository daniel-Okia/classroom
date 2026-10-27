import * as server from '../entries/pages/learn/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/learn/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/learn/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.Bl6QmBRf.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/svelte-head.CPwUDVcr.js","_app/immutable/chunks/attributes.RWISXkb6.js","_app/immutable/chunks/class.ChrbmzR5.js","_app/immutable/chunks/attributes.BKuqSeVd.js"];
export const stylesheets = [];
export const fonts = [];
