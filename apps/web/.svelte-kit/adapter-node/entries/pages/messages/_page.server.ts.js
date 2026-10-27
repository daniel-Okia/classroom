import { f as fail } from "../../../chunks/index2.js";
import { a as needActor } from "../../../chunks/ctx.js";
import { r as reportMessage, s as sendMessage, a as readThread } from "../../../chunks/hub.js";
import { c as childrenOf } from "../../../chunks/views.js";
import { i as inSchool, m as messageThreads } from "../../../chunks/db.js";
const load = async ({ locals }) => {
  const a = needActor(locals);
  const threads = await inSchool(a.schoolId, (tx) => tx.select().from(messageThreads));
  const out = [];
  for (const t of threads) {
    try {
      out.push({ ...t, messages: await readThread(a, t.id) });
    } catch {
    }
  }
  return { threads: out, children: a.roles.includes("guardian") ? await childrenOf(a) : [], me: a.id };
};
const actions = {
  send: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await sendMessage(needActor(locals), { childId: String(f.get("child")), kind: String(f.get("kind")), body: String(f.get("body")), threadId: String(f.get("thread") || "") || void 0 }, String(f.get("key")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
  },
  report: async ({ request, locals }) => {
    await reportMessage(needActor(locals), String((await request.formData()).get("id")));
    return { reported: true };
  }
};
export {
  actions,
  load
};
