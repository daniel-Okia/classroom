import { f as fail } from "../../../chunks/index2.js";
import { b as needRole } from "../../../chunks/ctx.js";
import { s as submitAnswer, m as myFeedback, t as tasksForStudent } from "../../../chunks/tasks.js";
const load = async ({ locals }) => {
  const a = needRole(locals, "student");
  return { tasks: await tasksForStudent(a), feedback: await myFeedback(a, a.id) };
};
const actions = {
  submit: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await submitAnswer(needRole(locals, "student"), String(f.get("task")), String(f.get("text") ?? ""), null, String(f.get("key")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { saved: true };
  }
};
export {
  actions,
  load
};
