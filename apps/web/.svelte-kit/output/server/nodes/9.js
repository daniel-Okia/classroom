import * as server from '../entries/pages/practice/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/practice/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/practice/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.BiJfTHGO.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/attributes.RWISXkb6.js"];
export const stylesheets = [];
export const fonts = [];
