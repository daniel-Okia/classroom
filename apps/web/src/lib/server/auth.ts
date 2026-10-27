import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { and, count, desc, eq, gt } from 'drizzle-orm';
import { db, schema, client } from './db';
import { normalisePhone } from './phone';
import { sms } from './sms';
import type { Actor, Role } from '@classroom/core';

const { otpCodes, authSessions, users } = schema;
const SECRET = process.env.AUTH_SECRET ?? 'dev-only-secret-change-me';
const h = (s: string) => createHash('sha256').update(SECRET + s).digest('hex');

export class AuthError extends Error { constructor(public code: string, msg: string) { super(msg); } }

const OTP_TTL_MS = 5 * 60_000, MAX_ATTEMPTS = 5, MAX_REQUESTS = 3, WINDOW_MS = 10 * 60_000;

/** Send a 6-digit code. At most 3 per phone per 10 minutes. */
export async function requestOtp(rawPhone: string): Promise<void> {
  const phone = normalisePhone(rawPhone);
  if (!phone) throw new AuthError('bad_phone', 'Enter a valid Ugandan phone number.');
  const since = new Date(Date.now() - WINDOW_MS);
  const [{ n }] = await db.select({ n: count() }).from(otpCodes).where(and(eq(otpCodes.phone, phone), gt(otpCodes.expiresAt, new Date(since.getTime() + OTP_TTL_MS))));
  if (n >= MAX_REQUESTS) throw new AuthError('rate_limited', 'Too many codes requested. Please wait a few minutes.');
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  await db.insert(otpCodes).values({ phone, codeHash: h(phone + code), expiresAt: new Date(Date.now() + OTP_TTL_MS) });
  await sms.send(phone, `Your Classroom code is ${code}. It expires in 5 minutes.`);
}

/** Verify the code; creates the user on first login. Returns a session token for the cookie. */
export async function verifyOtp(rawPhone: string, code: string, name?: string): Promise<{ token: string; userId: string; isNew: boolean }> {
  const phone = normalisePhone(rawPhone);
  if (!phone) throw new AuthError('bad_phone', 'Enter a valid Ugandan phone number.');
  const [row] = await db.select().from(otpCodes).where(and(eq(otpCodes.phone, phone), eq(otpCodes.consumed, false), gt(otpCodes.expiresAt, new Date()))).orderBy(desc(otpCodes.expiresAt)).limit(1);
  if (!row) throw new AuthError('no_code', 'That code has expired. Ask for a new one.');
  if (row.attempts >= MAX_ATTEMPTS) throw new AuthError('locked', 'Too many tries. Ask for a new code.');
  const good = timingSafeEqual(Buffer.from(h(phone + code.trim())), Buffer.from(row.codeHash));
  await db.update(otpCodes).set(good ? { consumed: true } : { attempts: row.attempts + 1 }).where(eq(otpCodes.id, row.id));
  if (!good) throw new AuthError('wrong_code', 'That code is not right. Please try again.');

  let [user] = await db.select().from(users).where(eq(users.phone, phone));
  const isNew = !user;
  if (!user) [user] = await db.insert(users).values({ phone, name: name?.trim() || 'New user' }).returning();
  const token = randomBytes(32).toString('base64url');
  await db.insert(authSessions).values({ id: h(token), userId: user!.id, expiresAt: new Date(Date.now() + 30 * 86400_000) });
  return { token, userId: user!.id, isNew };
}

export async function sessionUser(token: string | undefined) {
  if (!token) return null;
  const [s] = await db.select().from(authSessions).where(and(eq(authSessions.id, h(token)), gt(authSessions.expiresAt, new Date())));
  if (!s) return null;
  const [u] = await db.select().from(users).where(eq(users.id, s.userId));
  return u ?? null;
}
export const endSession = (token: string) => db.delete(authSessions).where(eq(authSessions.id, h(token)));

/** Build the Actor from DB memberships. Chooses `preferredSchool` if the user belongs to it, else the first. */
export async function actorFor(userId: string, preferredSchool?: string | null): Promise<Actor> {
  const [u] = await db.select().from(users).where(eq(users.id, userId));
  if (u?.isPlatformAdmin) return { id: userId, roles: ['platform_admin'], schoolId: null };
  const rows = await client`select school_id, role from user_memberships(${userId})`;
  const school = rows.find((r) => r.school_id === preferredSchool)?.school_id ?? rows[0]?.school_id ?? null;
  const roles = rows.filter((r) => r.school_id === school).map((r) => r.role as Role);
  return { id: userId, roles, schoolId: school };
}
