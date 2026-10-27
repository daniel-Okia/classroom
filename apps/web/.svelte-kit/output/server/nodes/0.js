import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.BM6bsdIq.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/index-client.Dp9BzwS1.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/each.DVc5LMv3.js","_app/immutable/chunks/attributes.RWISXkb6.js","_app/immutable/chunks/store.BoIo8Emr.js","_app/immutable/chunks/index.CADa0VP9.js","_app/immutable/chunks/stores.B-QI2CfK.js","_app/immutable/chunks/entry.DD7OQoMf.js","_app/immutable/chunks/outbox.CjdloonQ.js"];
export const stylesheets = ["_app/immutable/assets/0.DO_7VHJG.css"];
export const fonts = [];
