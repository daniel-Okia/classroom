import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loginUrl } from '$lib/server/next';
import { pendingSchools, verifySchool } from '$lib/server/schools';
export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) throw redirect(303, loginUrl(url));
  if (!locals.actor?.roles.includes('platform_admin')) throw error(403, 'Not allowed');
  return { schools: await pendingSchools() };
};
export const actions: Actions = {
  decide: async ({ request, locals }) => {
    const f = await request.formData(); await verifySchool(locals.actor!, String(f.get('id')), f.get('approve') === '1');
  },
};
