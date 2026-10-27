// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { listJoinRequests, decideJoinRequest } from '$lib/server/schools';
import { needRole } from '$lib/server/ctx';
export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => ({ requests: await listJoinRequests(needRole(locals, 'school_admin')) });
export const actions = {
  decide: async ({ request, locals }: import('./$types').RequestEvent) => { const f = await request.formData(); await decideJoinRequest(needRole(locals, 'school_admin'), String(f.get('id')), f.get('approve') === '1'); },
};
;null as any as Actions;