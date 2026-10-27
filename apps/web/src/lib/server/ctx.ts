import { redirect, error } from '@sveltejs/kit';
import type { Actor } from '@classroom/core';
export function needUser(locals: App.Locals) { if (!locals.user) throw redirect(303, '/login'); return locals.user; }
export function needActor(locals: App.Locals): Actor { needUser(locals); if (!locals.actor?.schoolId) throw redirect(303, '/'); return locals.actor; }
export function needRole(locals: App.Locals, ...roles: string[]): Actor { const a = needActor(locals); if (!a.roles.some((r) => roles.includes(r))) throw error(403, 'Not allowed'); return a; }
export const mondayOf = (d = new Date()) => { const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); const i = (x.getUTCDay() + 6) % 7; x.setUTCDate(x.getUTCDate() - i); return { start: x.toISOString().slice(0, 10), end: new Date(x.getTime() + 6 * 864e5).toISOString().slice(0, 10), dayIndex: i }; };
export const today = () => new Date().toISOString().slice(0, 10);
