import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { needActor } from '$lib/server/ctx';
import { chooseSlot } from '$lib/server/study';
import { inSchool, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
  const a = needActor(locals);
  return inSchool(a.schoolId!, async (tx) => { const [e] = await tx.select().from(schema.packageEnrolments).where(eq(schema.packageEnrolments.id, params.id));
    const [p] = e ? await tx.select().from(schema.holidayPackages).where(eq(schema.holidayPackages.id, e.packageId)) : [];
    return { pkg: p ?? null }; });
};
export const actions: Actions = {
  default: async ({ request, locals, params }) => { const f = await request.formData();
    try { await chooseSlot(needActor(locals), params.id, String(f.get('start')), Number(f.get('minutes'))); } catch (e: any) { return fail(400, { error: e.message }); }
    throw redirect(303, '/'); },
};
