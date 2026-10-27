import { a as needActor } from "../../../chunks/ctx.js";
import { c as childrenOf, w as weekFor } from "../../../chunks/views.js";
import { F as Forbidden } from "../../../chunks/schools.js";
const load = async ({ locals, url }) => {
  const a = needActor(locals);
  const want = url.searchParams.get("child") ?? a.id;
  if (want !== a.id) {
    const kids = await childrenOf(a);
    if (!kids.some((k) => k.id === want)) throw new Forbidden();
  }
  return { week: await weekFor(a, want) };
};
export {
  load
};
