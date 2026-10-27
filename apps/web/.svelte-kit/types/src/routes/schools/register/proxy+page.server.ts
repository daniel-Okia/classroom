// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registerSchool } from '$lib/server/schools';
import { normalisePhone } from '$lib/server/phone';

export const load = ({ locals }: Parameters<PageServerLoad>[0]) => { if (!locals.user) throw redirect(303, '/login'); return {}; };
export const actions = {
  default: async ({ request, locals, cookies }: import('./$types').RequestEvent) => {
    if (!locals.user) throw redirect(303, '/login');
    const f = await request.formData(); const g = (k: string) => String(f.get(k) ?? '').trim();
    const contact = normalisePhone(g('contact'));
    if (!g('name') || !g('district') || !contact) return fail(400, { error: 'Please fill in the school name, district and a valid contact phone.', v: Object.fromEntries(f) as Record<string, string> });
    const faith = (['full', 'light', 'off'].includes(g('faith')) ? g('faith') : 'light') as 'full' | 'light' | 'off';
    const r = await registerSchool({ name: g('name'), district: g('district'), levelFrom: g('from'), levelTo: g('to'), contactPhone: contact, adminUserId: locals.user.id, faith });
    cookies.set('school', r.schoolId, { path: '/', httpOnly: true, sameSite: 'lax' });
    return { done: true, code: r.joinCode };
  },
};
;null as any as Actions;