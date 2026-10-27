import { d as decideJoinRequest, l as listJoinRequests } from "../../../../chunks/schools.js";
import { b as needRole } from "../../../../chunks/ctx.js";
const load = async ({ locals }) => ({ requests: await listJoinRequests(needRole(locals, "school_admin")) });
const actions = {
  decide: async ({ request, locals }) => {
    const f = await request.formData();
    await decideJoinRequest(needRole(locals, "school_admin"), String(f.get("id")), f.get("approve") === "1");
  }
};
export {
  actions,
  load
};
