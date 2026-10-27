import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { loginUrl } from '$lib/server/next';
import type { PageServerLoad } from './$types';
import { db, schema } from '$lib/server/db';
export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) throw redirect(303, loginUrl(url));
  const [u] = await db.select({ name: schema.users.name, phone: schema.users.phone }).from(schema.users).where(eq(schema.users.id, locals.user.id));
  return { name: u?.name ?? locals.user.name, phone: u?.phone ?? '', roles: locals.actor?.roles ?? [] };
};
