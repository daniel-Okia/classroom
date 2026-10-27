import { f as fail } from "../../../chunks/index2.js";
import { a as needActor } from "../../../chunks/ctx.js";
import { u as updateRequest, b as submitRequest, c as rsvp, d as markRead, e as ensureRequestTypes, l as listEvents, m as myRequests, n as noticesForGuardian, f as requestInbox } from "../../../chunks/hub.js";
import { c as childrenOf } from "../../../chunks/views.js";
import { c as client } from "../../../chunks/db.js";
const load = async ({ locals }) => {
  const a = needActor(locals);
  const guardian = a.roles.includes("guardian");
  const [s] = await client`select name, district, contact_phone from school where id = ${a.schoolId}`;
  const base = { school: s, events: await listEvents(a), types: await ensureRequestTypes(a.schoolId), guardian };
  if (guardian) return { ...base, notices: await noticesForGuardian(a).catch(() => []), children: await childrenOf(a), mine: await myRequests(a), inbox: [] };
  const canInbox = a.roles.some((r) => ["teacher", "school_admin", "head_teacher", "bursar"].includes(r));
  return { ...base, notices: [], children: [], mine: [], inbox: canInbox ? await requestInbox(a) : [] };
};
const actions = {
  read: async ({ request, locals }) => {
    await markRead(needActor(locals), String((await request.formData()).get("id")));
  },
  rsvp: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await rsvp(needActor(locals), String(f.get("event")), String(f.get("child")), String(f.get("response")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { rsvp: true };
  },
  request: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await submitRequest(needActor(locals), String(f.get("type")), String(f.get("child")), String(f.get("body")), String(f.get("key")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { requested: true };
  },
  status: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await updateRequest(needActor(locals), String(f.get("id")), String(f.get("status")), String(f.get("note") ?? "") || void 0);
    } catch (e) {
      return fail(400, { error: e.message });
    }
  }
};
export {
  actions,
  load
};
