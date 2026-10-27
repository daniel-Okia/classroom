import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { needActor } from '$lib/server/ctx';
import { postNotice, createEvent, type Audience } from '$lib/server/hub';
export const actions: Actions = {
  notice: async ({ request, locals }) => { const f = await request.formData(); const kind = String(f.get('audience'));
    const audience: Audience = kind === 'level' ? { kind: 'level', level: String(f.get('level')) } : kind === 'class' ? { kind: 'class', classId: String(f.get('classId')) } : { kind: 'school' };
    try { await postNotice(needActor(locals), { title: String(f.get('title')), body: String(f.get('body')), priority: String(f.get('priority')) as any, audience, verse: String(f.get('verse') || '') || undefined }); } catch (e: any) { return fail(400, { error: e.message }); }
    return { posted: true }; },
  event: async ({ request, locals }) => { const f = await request.formData();
    try { await createEvent(needActor(locals), { title: String(f.get('title')), kind: String(f.get('kind')), startsAt: new Date(String(f.get('starts'))), rsvpDeadline: f.get('deadline') ? new Date(String(f.get('deadline'))) : undefined, needsConsent: f.get('consent') === 'on' }); } catch (e: any) { return fail(400, { error: e.message }); }
    return { eventPosted: true }; },
};
