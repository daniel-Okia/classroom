import type { Handle } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { sessionUser, actorFor } from '$lib/server/auth';
import { inSchool, schema } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
  const user = await sessionUser(event.cookies.get('sid'));
  event.locals.user = user ? { id: user.id, name: user.name } : null;
  event.locals.actor = null;
  if (user) {
    let actor = await actorFor(user.id, event.cookies.get('school'));
    // "Study as <child>": only if the signed-in person is a linked guardian of that child in the active school.
    const as = event.cookies.get('as');
    if (as && actor.schoolId && actor.roles.includes('guardian')) {
      const [link] = await inSchool(actor.schoolId, (tx) => tx.select().from(schema.parentChildLinks).where(and(eq(schema.parentChildLinks.guardianId, user.id), eq(schema.parentChildLinks.childId, as))));
      if (link) actor = { id: as, roles: ['student'], schoolId: actor.schoolId };
    }
    event.locals.actor = actor;
  }
  const res = await resolve(event);
  res.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-ancestors 'none'");
  res.headers.set('X-Content-Type-Options', 'nosniff'); res.headers.set('Referrer-Policy', 'same-origin');
  return res;
};
