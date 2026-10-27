// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolveJoin, createJoinRequest } from '$lib/server/schools';
import { actorFor } from '$lib/server/auth';

export const load = async ({ url, locals }: Parameters<PageServerLoad>[0]) => {
  if (!locals.user) throw redirect(303, `/login`);
  const code = url.searchParams.get('c'); const qr = url.searchParams.get('t');
  const target = code || qr ? await resolveJoin({ code: code ?? undefined, qr: qr ?? undefined }) : null;
  return { target, code, notFound: !!(code || qr) && !target };
};
export const actions = {
  lookup: async ({ request }: import('./$types').RequestEvent) => {
    const code = String((await request.formData()).get('code') ?? '');
    const t = await resolveJoin({ code }); if (!t) return fail(404, { error: 'We could not find that code. Check it and try again.' });
    throw redirect(303, `/join?c=${encodeURIComponent(code)}`);
  },
  request: async ({ request, locals }: import('./$types').RequestEvent) => {
    const f = await request.formData(); const child = String(f.get('child') ?? '').trim();
    if (!child) return fail(400, { error: "Please type your child's name." });
    const t = await resolveJoin({ code: String(f.get('code')) }); if (!t) return fail(404, { error: 'That code is no longer valid.' });
    await createJoinRequest(await actorFor(locals.user!.id), t, child);
    return { sent: true, school: t.schoolName };
  },
};
;null as any as Actions;