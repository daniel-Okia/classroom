import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { requestOtp, verifyOtp, AuthError } from '$lib/server/auth';

const hits = new Map<string, number[]>();   // per-IP limiter (OTP endpoints); DB limiter is per phone
const limited = (ip: string) => { const now = Date.now(); const a = (hits.get(ip) ?? []).filter((t) => now - t < 600_000); a.push(now); hits.set(ip, a); return a.length > 20; };

export const actions: Actions = {
  send: async ({ request, getClientAddress }) => {
    const f = await request.formData(); const phone = String(f.get('phone') ?? '');
    if (limited(getClientAddress())) return fail(429, { phone, error: 'Too many attempts. Please wait a few minutes.' });
    try { await requestOtp(phone); } catch (e) { if (e instanceof AuthError) return fail(400, { phone, error: e.message }); throw e; }
    return { phone, sent: true };
  },
  verify: async ({ request, cookies, getClientAddress }) => {
    const f = await request.formData(); const phone = String(f.get('phone') ?? ''); const code = String(f.get('code') ?? ''); const name = String(f.get('name') ?? '');
    if (limited(getClientAddress())) return fail(429, { phone, sent: true, error: 'Too many attempts. Please wait a few minutes.' });
    try {
      const r = await verifyOtp(phone, code, name);
      cookies.set('sid', r.token, { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 30 * 86400 });
    } catch (e) { if (e instanceof AuthError) return fail(400, { phone, sent: true, error: e.message }); throw e; }
    throw redirect(303, '/');
  },
};
