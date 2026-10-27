import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { endSession } from '$lib/server/auth';
export const POST: RequestHandler = async ({ cookies }) => {
  const sid = cookies.get('sid'); if (sid) await endSession(sid);
  for (const c of ['sid', 'school', 'as']) cookies.delete(c, { path: '/' });
  throw redirect(303, '/login');
};
