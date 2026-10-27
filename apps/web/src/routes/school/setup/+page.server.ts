import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createClass } from '$lib/server/schools';
import { createPackage } from '$lib/server/study';
import { needRole } from '$lib/server/ctx';
import { inSchool, schema } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => { const a = needRole(locals, 'school_admin');
  return inSchool(a.schoolId!, async (tx) => ({ classes: await tx.select().from(schema.classes), packages: await tx.select().from(schema.holidayPackages) })); };
export const actions: Actions = {
  addClass: async ({ request, locals }) => { const f = await request.formData(); const n = String(f.get('name')).trim(), l = String(f.get('level')).trim();
    if (!n || !l) return fail(400, { error: 'Add a class name and level.' }); await createClass(needRole(locals, 'school_admin'), n, l); },
  addPackage: async ({ request, locals }) => { const f = await request.formData();
    try { await createPackage(needRole(locals, 'school_admin'), { name: String(f.get('name')), startDate: String(f.get('start')), endDate: String(f.get('end')), weeklyHourGoal: Number(f.get('goal')),
      slotOptions: String(f.get('slots')).split(',').map((s) => s.trim()).filter(Boolean), subjectIds: [], classIds: [] }); } catch (e: any) { return fail(400, { error: e.message }); } },
};
