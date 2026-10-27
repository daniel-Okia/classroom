import { r as redirect, f as fail } from "../../../../chunks/index2.js";
import { f as registerSchool } from "../../../../chunks/schools.js";
import { n as normalisePhone } from "../../../../chunks/phone.js";
const load = ({ locals }) => {
  if (!locals.user) throw redirect(303, "/login");
  return {};
};
const actions = {
  default: async ({ request, locals, cookies }) => {
    if (!locals.user) throw redirect(303, "/login");
    const f = await request.formData();
    const g = (k) => String(f.get(k) ?? "").trim();
    const contact = normalisePhone(g("contact"));
    if (!g("name") || !g("district") || !contact) return fail(400, { error: "Please fill in the school name, district and a valid contact phone.", v: Object.fromEntries(f) });
    const faith = ["full", "light", "off"].includes(g("faith")) ? g("faith") : "light";
    const r = await registerSchool({ name: g("name"), district: g("district"), levelFrom: g("from"), levelTo: g("to"), contactPhone: contact, adminUserId: locals.user.id, faith });
    cookies.set("school", r.schoolId, { path: "/", httpOnly: true, sameSite: "lax" });
    return { done: true, code: r.joinCode };
  }
};
export {
  actions,
  load
};
