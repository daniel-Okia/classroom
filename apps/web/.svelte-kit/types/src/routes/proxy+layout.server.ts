// @ts-nocheck
import type { LayoutServerLoad } from './$types';
export const load = async ({ locals, url }: Parameters<LayoutServerLoad>[0]) => ({ user: locals.user, roles: locals.actor?.roles ?? [], hasSchool: !!locals.actor?.schoolId, path: url.pathname });
