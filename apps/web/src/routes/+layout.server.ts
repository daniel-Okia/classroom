import type { LayoutServerLoad } from './$types';
import { client } from '$lib/server/db';
export const load: LayoutServerLoad = async ({ locals, url }) => {
  const sid = locals.actor?.schoolId;
  const school = sid ? (await client`select name from school where id = ${sid}`)[0]?.name ?? null : null;
  return { user: locals.user, roles: locals.actor?.roles ?? [], hasSchool: !!sid, school, path: url.pathname };
};
