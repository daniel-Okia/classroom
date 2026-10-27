import { r as redirect } from "../../../chunks/index2.js";
import { e as endSession } from "../../../chunks/auth.js";
const POST = async ({ cookies }) => {
  const sid = cookies.get("sid");
  if (sid) await endSession(sid);
  for (const c of ["sid", "school", "as"]) cookies.delete(c, { path: "/" });
  throw redirect(303, "/login");
};
export {
  POST
};
