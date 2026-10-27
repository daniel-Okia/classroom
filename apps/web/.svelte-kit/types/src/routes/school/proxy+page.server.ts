// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { needActor } from '$lib/server/ctx';
import { noticesForGuardian, markRead, listEvents, rsvp, ensureRequestTypes, submitRequest, myRequests, requestInbox, updateRequest } from '$lib/server/hub';
import { childrenOf } from '$lib/server/views';
import { client } from '$lib/server/db';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  const a = needActor(locals); const guardian = a.roles.includes('guardian');
  const [s] = await client`select name, district, contact_phone from school where id = ${a.schoolId!}`;
  const base = { school: s, events: await listEvents(a), types: await ensureRequestTypes(a.schoolId!), guardian };
  if (guardian) return { ...base, notices: await noticesForGuardian(a).catch(() => []), children: await childrenOf(a), mine: await myRequests(a), inbox: [] as any[] };
  const canInbox = a.roles.some((r) => ['teacher', 'school_admin', 'head_teacher', 'bursar'].includes(r));
  return { ...base, notices: [] as any[], children: [] as any[], mine: [] as any[], inbox: canInbox ? await requestInbox(a) : [] };
};
export const actions = {
  read: async ({ request, locals }: import('./$types').RequestEvent) => { await markRead(needActor(locals), String((await request.formData()).get('id'))); },
  rsvp: async ({ request, locals }: import('./$types').RequestEvent) => { const f = await request.formData();
    try { await rsvp(needActor(locals), String(f.get('event')), String(f.get('child')), String(f.get('response')) as any); } catch (e: any) { return fail(400, { error: e.message }); } return { rsvp: true }; },
  request: async ({ request, locals }: import('./$types').RequestEvent) => { const f = await request.formData();
    try { await submitRequest(needActor(locals), String(f.get('type')), String(f.get('child')), String(f.get('body')), String(f.get('key'))); } catch (e: any) { return fail(400, { error: e.message }); } return { requested: true }; },
  status: async ({ request, locals }: import('./$types').RequestEvent) => { const f = await request.formData();
    try { await updateRequest(needActor(locals), String(f.get('id')), String(f.get('status')) as any, String(f.get('note') ?? '') || undefined); } catch (e: any) { return fail(400, { error: e.message }); } },
};
;null as any as Actions;