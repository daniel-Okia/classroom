import { f as fail, r as redirect } from "../../../../chunks/index2.js";
import { a as needActor } from "../../../../chunks/ctx.js";
import { a as chooseSlot } from "../../../../chunks/study.js";
import { i as inSchool, p as packageEnrolments, h as holidayPackages } from "../../../../chunks/db.js";
import { eq } from "drizzle-orm";
const load = async ({ locals, params }) => {
  const a = needActor(locals);
  return inSchool(a.schoolId, async (tx) => {
    const [e] = await tx.select().from(packageEnrolments).where(eq(packageEnrolments.id, params.id));
    const [p] = e ? await tx.select().from(holidayPackages).where(eq(holidayPackages.id, e.packageId)) : [];
    return { pkg: p ?? null };
  });
};
const actions = {
  default: async ({ request, locals, params }) => {
    const f = await request.formData();
    try {
      await chooseSlot(needActor(locals), params.id, String(f.get("start")), Number(f.get("minutes")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
    throw redirect(303, "/");
  }
};
export {
  actions,
  load
};
