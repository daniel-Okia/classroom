import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { applySync } from '$lib/server/session-flow';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.actor?.schoolId) throw error(401, 'Sign in first');
  const item = await request.json().catch(() => null);
  if (!item || typeof item.clientKey !== 'string' || item.clientKey.length > 80) throw error(400, 'Bad request');
  try { return json(await applySync(locals.actor, item)); }
  catch (e: any) { throw error(e instanceof RangeError ? 400 : 403, e.message); }
};
