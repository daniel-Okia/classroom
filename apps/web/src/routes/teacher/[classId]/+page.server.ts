import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { needRole } from '$lib/server/ctx';
import { assignTask, reviewQueue, markSubmission } from '$lib/server/tasks';
import { inSchool, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
  const a = needRole(locals, 'teacher', 'school_admin', 'head_teacher');
  const queue = await reviewQueue(a);
  const names = await inSchool(a.schoolId!, (tx) => tx.select({ id: schema.users.id, name: schema.users.name }).from(schema.users));
  return { classId: params.classId, queue: queue.map((q) => ({ ...q, student: names.find((n) => n.id === q.studentId)?.name ?? 'Student' })) };
};
export const actions: Actions = {
  assign: async ({ request, locals, params }) => { const f = await request.formData();
    try { await assignTask(needRole(locals, 'teacher'), { classId: params.classId, title: String(f.get('title')), instructions: String(f.get('instructions')), dueDate: String(f.get('due') || '') || undefined }); } catch (e: any) { return fail(400, { error: e.message }); }
    return { assigned: true }; },
  mark: async ({ request, locals }) => { const f = await request.formData();
    try { await markSubmission(needRole(locals, 'teacher'), String(f.get('id')), Number(f.get('score')), Number(f.get('max')), String(f.get('comment') ?? '')); } catch (e: any) { return fail(400, { error: e.message }); } },
};
void eq;
