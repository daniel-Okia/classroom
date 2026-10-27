import * as server from '../entries/pages/progress/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/progress/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/progress/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.CNcmH3so.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/class.ChrbmzR5.js","_app/immutable/chunks/attributes.BKuqSeVd.js"];
export const stylesheets = [];
export const fonts = [];
