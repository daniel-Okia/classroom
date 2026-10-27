import type { Actions, PageServerLoad } from './$types';
import { listJoinRequests, decideJoinRequest } from '$lib/server/schools';
import { needRole } from '$lib/server/ctx';
export const load: PageServerLoad = async ({ locals }) => ({ requests: await listJoinRequests(needRole(locals, 'school_admin')) });
export const actions: Actions = {
  decide: async ({ request, locals }) => { const f = await request.formData(); await decideJoinRequest(needRole(locals, 'school_admin'), String(f.get('id')), f.get('approve') === '1'); },
};
