import { f as fail } from "../../../../chunks/index2.js";
import { b as needRole } from "../../../../chunks/ctx.js";
import { a as markSubmission, b as assignTask, r as reviewQueue } from "../../../../chunks/tasks.js";
import { i as inSchool, u as users } from "../../../../chunks/db.js";
const load = async ({ locals, params }) => {
  const a = needRole(locals, "teacher", "school_admin", "head_teacher");
  const queue = await reviewQueue(a);
  const names = await inSchool(a.schoolId, (tx) => tx.select({ id: users.id, name: users.name }).from(users));
  return { classId: params.classId, queue: queue.map((q) => ({ ...q, student: names.find((n) => n.id === q.studentId)?.name ?? "Student" })) };
};
const actions = {
  assign: async ({ request, locals, params }) => {
    const f = await request.formData();
    try {
      await assignTask(needRole(locals, "teacher"), { classId: params.classId, title: String(f.get("title")), instructions: String(f.get("instructions")), dueDate: String(f.get("due") || "") || void 0 });
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { assigned: true };
  },
  mark: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await markSubmission(needRole(locals, "teacher"), String(f.get("id")), Number(f.get("score")), Number(f.get("max")), String(f.get("comment") ?? ""));
    } catch (e) {
      return fail(400, { error: e.message });
    }
  }
};
export {
  actions,
  load
};
