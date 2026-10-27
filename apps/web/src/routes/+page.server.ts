import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { childrenOf, weekFor, classOverview, faithFor, pendingJoins, enrolmentFor, openPackages } from '$lib/server/views';
import { verseOfTheDay } from '$lib/server/library';
import { noticesForGuardian, myRequests } from '$lib/server/hub';
import { enrolChild } from '$lib/server/study';
import { db, schema, client } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) return { mode: 'public' as const };
  const a = locals.actor;
  if (!a?.schoolId) return { mode: a?.roles.includes('platform_admin') ? 'platform' : 'none' as const };
  const faith = await faithFor(a.schoolId);
  const doy = Math.floor((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 864e5);
  const verse = await verseOfTheDay(faith as any, doy);
  if (a.roles.includes('student')) {
    const [me] = a.id === locals.user.id ? [{ name: locals.user.name }] : await db.select({ name: schema.users.name }).from(schema.users).where(eq(schema.users.id, a.id));
    return { mode: 'student' as const, name: me?.name ?? locals.user.name, verse, week: await weekFor(a, a.id), enrolment: await enrolmentFor(a, a.id) };
  }
  if (a.roles.includes('guardian')) {
    const kids = await childrenOf(a);
    const children = await Promise.all(kids.map(async (k) => ({ ...k, week: await weekFor(a, k.id), enrolment: await enrolmentFor(a, k.id) })));
    return { mode: 'guardian' as const, verse, children, notices: (await noticesForGuardian(a).catch(() => [])).slice(0, 4), requests: (await myRequests(a)).slice(0, 3), packages: await openPackages(a) };
  }
  const isAdmin = a.roles.includes('school_admin');
  const [sch] = await client`select verify_status from school where id = ${a.schoolId}`;
  return { mode: 'staff' as const, classes: await classOverview(a), pending: isAdmin ? (await pendingJoins(a)).length : 0, isAdmin, verified: sch?.verify_status === 'verified', packageCount: (await openPackages(a)).length };
};

export const actions: Actions = {
  studyAs: async ({ request, cookies }) => { const id = String((await request.formData()).get('child')); cookies.set('as', id, { path: '/', httpOnly: true, sameSite: 'lax' }); throw redirect(303, '/'); },
  exitChild: async ({ cookies }) => { cookies.delete('as', { path: '/' }); throw redirect(303, '/'); },
  enrol: async ({ request, locals }) => {
    const f = await request.formData();
    try { await enrolChild(locals.actor!, String(f.get('pkg')), String(f.get('child'))); } catch (e: any) { return fail(400, { error: e.message }); }
    return { enrolled: true };
  },
};
