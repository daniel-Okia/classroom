import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ locals, url }) => ({ user: locals.user, roles: locals.actor?.roles ?? [], hasSchool: !!locals.actor?.schoolId, path: url.pathname });
