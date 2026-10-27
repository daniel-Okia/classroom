import { f as fail } from "../../../../chunks/index2.js";
import { a as needActor } from "../../../../chunks/ctx.js";
import { g as createEvent, p as postNotice } from "../../../../chunks/hub.js";
const actions = {
  notice: async ({ request, locals }) => {
    const f = await request.formData();
    const kind = String(f.get("audience"));
    const audience = kind === "level" ? { kind: "level", level: String(f.get("level")) } : kind === "class" ? { kind: "class", classId: String(f.get("classId")) } : { kind: "school" };
    try {
      await postNotice(needActor(locals), { title: String(f.get("title")), body: String(f.get("body")), priority: String(f.get("priority")), audience, verse: String(f.get("verse") || "") || void 0 });
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { posted: true };
  },
  event: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await createEvent(needActor(locals), { title: String(f.get("title")), kind: String(f.get("kind")), startsAt: new Date(String(f.get("starts"))), rsvpDeadline: f.get("deadline") ? new Date(String(f.get("deadline"))) : void 0, needsConsent: f.get("consent") === "on" });
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { eventPosted: true };
  }
};
export {
  actions
};
