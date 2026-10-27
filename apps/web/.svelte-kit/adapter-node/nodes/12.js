import * as server from '../entries/pages/school/notices/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/school/notices/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/school/notices/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.CDZgujWM.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/if.B7_HkxNR.js"];
export const stylesheets = [];
export const fonts = [];
