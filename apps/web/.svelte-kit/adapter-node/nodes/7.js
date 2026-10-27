import * as server from '../entries/pages/messages/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/messages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/messages/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.Dyo871Di.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/attributes.RWISXkb6.js","_app/immutable/chunks/style.ssG7wXlE.js","_app/immutable/chunks/attributes.BKuqSeVd.js"];
export const stylesheets = [];
export const fonts = [];
