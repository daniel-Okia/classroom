import * as server from '../entries/pages/join/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/join/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/join/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.Cs7yEdPH.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/svelte-head.CPwUDVcr.js","_app/immutable/chunks/attributes.RWISXkb6.js"];
export const stylesheets = [];
export const fonts = [];
