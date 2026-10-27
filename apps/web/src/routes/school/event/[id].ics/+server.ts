import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { needActor } from '$lib/server/ctx';
import { listEvents, icsFor } from '$lib/server/hub';
export const GET: RequestHandler = async ({ locals, params }) => {
  const e = (await listEvents(needActor(locals))).find((x) => x.id === params.id.replace(/\.ics$/, ''));
  if (!e) throw error(404, 'Event not found');
  return new Response(icsFor(e), { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="event.ics"' } });
};
