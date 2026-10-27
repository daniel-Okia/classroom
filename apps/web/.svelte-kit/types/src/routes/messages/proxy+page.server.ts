// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { needActor } from '$lib/server/ctx';
import { sendMessage, readThread, reportMessage } from '$lib/server/hub';
import { childrenOf } from '$lib/server/views';
import { inSchool, schema } from '$lib/server/db';
export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  const a = needActor(locals);
  const threads = await inSchool(a.schoolId!, (tx) => tx.select().from(schema.messageThreads));
  const out = [];
  for (const t of threads) { try { out.push({ ...t, messages: await readThread(a, t.id) }); } catch { /* not a participant */ } }
  return { threads: out, children: a.roles.includes('guardian') ? await childrenOf(a) : [], me: a.id };
};
export const actions = {
  send: async ({ request, locals }: import('./$types').RequestEvent) => { const f = await request.formData();
    try { await sendMessage(needActor(locals), { childId: String(f.get('child')), kind: String(f.get('kind')) as any, body: String(f.get('body')), threadId: String(f.get('thread') || '') || undefined }, String(f.get('key'))); } catch (e: any) { return fail(400, { error: e.message }); } },
  report: async ({ request, locals }: import('./$types').RequestEvent) => { await reportMessage(needActor(locals), String((await request.formData()).get('id'))); return { reported: true }; },
};
;null as any as Actions;