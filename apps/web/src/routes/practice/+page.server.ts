import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { needRole } from '$lib/server/ctx';
import { tasksForStudent, submitAnswer, myFeedback } from '$lib/server/tasks';
export const load: PageServerLoad = async ({ locals }) => { const a = needRole(locals, 'student'); return { tasks: await tasksForStudent(a), feedback: await myFeedback(a, a.id) }; };
export const actions: Actions = {
  submit: async ({ request, locals }) => { const f = await request.formData();
    try { await submitAnswer(needRole(locals, 'student'), String(f.get('task')), String(f.get('text') ?? ''), null, String(f.get('key'))); } catch (e: any) { return fail(400, { error: e.message }); }
    return { saved: true }; },
};
