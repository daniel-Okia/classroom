import { f as fail } from "../../../../chunks/index2.js";
import { e as createClass } from "../../../../chunks/schools.js";
import { c as createPackage } from "../../../../chunks/study.js";
import { b as needRole } from "../../../../chunks/ctx.js";
import { i as inSchool, h as holidayPackages, a as classes } from "../../../../chunks/db.js";
const load = async ({ locals }) => {
  const a = needRole(locals, "school_admin");
  return inSchool(a.schoolId, async (tx) => ({ classes: await tx.select().from(classes), packages: await tx.select().from(holidayPackages) }));
};
const actions = {
  addClass: async ({ request, locals }) => {
    const f = await request.formData();
    const n = String(f.get("name")).trim(), l = String(f.get("level")).trim();
    if (!n || !l) return fail(400, { error: "Add a class name and level." });
    await createClass(needRole(locals, "school_admin"), n, l);
  },
  addPackage: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await createPackage(needRole(locals, "school_admin"), {
        name: String(f.get("name")),
        startDate: String(f.get("start")),
        endDate: String(f.get("end")),
        weeklyHourGoal: Number(f.get("goal")),
        slotOptions: String(f.get("slots")).split(",").map((s) => s.trim()).filter(Boolean),
        subjectIds: [],
        classIds: []
      });
    } catch (e) {
      return fail(400, { error: e.message });
    }
  }
};
export {
  actions,
  load
};
