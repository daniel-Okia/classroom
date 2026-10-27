import { l as libraryTree } from "../../../chunks/library.js";
import { n as needUser } from "../../../chunks/ctx.js";
const load = async ({ locals, url }) => {
  needUser(locals);
  const track = url.searchParams.get("track") === "legacy" ? "legacy" : "new";
  return { track, tree: await libraryTree(track) };
};
export {
  load
};
