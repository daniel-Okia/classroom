import { r as redirect, e as error } from "../../../chunks/index2.js";
import { v as verifySchool, p as pendingSchools } from "../../../chunks/schools.js";
const load = async ({ locals }) => {
  if (!locals.user) throw redirect(303, "/login");
  if (!locals.actor?.roles.includes("platform_admin")) throw error(403, "Not allowed");
  return { schools: await pendingSchools() };
};
const actions = {
  decide: async ({ request, locals }) => {
    const f = await request.formData();
    await verifySchool(locals.actor, String(f.get("id")), f.get("approve") === "1");
  }
};
export {
  actions,
  load
};
