import { timingSafeEqual, randomBytes, randomInt, createHash } from "node:crypto";
import { eq, and, gt, desc, count } from "drizzle-orm";
import { d as db, s as schema, c as client } from "./db.js";
import { n as normalisePhone } from "./phone.js";
const consoleSms = { async send(phone, text) {
  console.log(`[sms:dev] to ${phone}: ${text}`);
} };
const africasTalking = {
  async send(phone, text) {
    const res = await fetch("https://api.africastalking.com/version1/messaging", {
      method: "POST",
      headers: { apiKey: process.env.AT_API_KEY, "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({ username: process.env.AT_USERNAME, to: phone, message: text })
    });
    if (!res.ok) throw new Error(`SMS failed ${res.status}`);
  }
};
let sms = process.env.AT_API_KEY ? africasTalking : consoleSms;
const { otpCodes, authSessions, users } = schema;
const SECRET = process.env.AUTH_SECRET ?? "dev-only-secret-change-me";
const h = (s) => createHash("sha256").update(SECRET + s).digest("hex");
class AuthError extends Error {
  constructor(code, msg) {
    super(msg);
    this.code = code;
  }
}
const OTP_TTL_MS = 5 * 6e4, MAX_ATTEMPTS = 5, MAX_REQUESTS = 3, WINDOW_MS = 10 * 6e4;
async function requestOtp(rawPhone) {
  const phone = normalisePhone(rawPhone);
  if (!phone) throw new AuthError("bad_phone", "Enter a valid Ugandan phone number.");
  const since = new Date(Date.now() - WINDOW_MS);
  const [{ n }] = await db.select({ n: count() }).from(otpCodes).where(and(eq(otpCodes.phone, phone), gt(otpCodes.expiresAt, new Date(since.getTime() + OTP_TTL_MS))));
  if (n >= MAX_REQUESTS) throw new AuthError("rate_limited", "Too many codes requested. Please wait a few minutes.");
  const code = String(randomInt(0, 1e6)).padStart(6, "0");
  await db.insert(otpCodes).values({ phone, codeHash: h(phone + code), expiresAt: new Date(Date.now() + OTP_TTL_MS) });
  await sms.send(phone, `Your Classroom code is ${code}. It expires in 5 minutes.`);
}
async function verifyOtp(rawPhone, code, name) {
  const phone = normalisePhone(rawPhone);
  if (!phone) throw new AuthError("bad_phone", "Enter a valid Ugandan phone number.");
  const [row] = await db.select().from(otpCodes).where(and(eq(otpCodes.phone, phone), eq(otpCodes.consumed, false), gt(otpCodes.expiresAt, /* @__PURE__ */ new Date()))).orderBy(desc(otpCodes.expiresAt)).limit(1);
  if (!row) throw new AuthError("no_code", "That code has expired. Ask for a new one.");
  if (row.attempts >= MAX_ATTEMPTS) throw new AuthError("locked", "Too many tries. Ask for a new code.");
  const good = timingSafeEqual(Buffer.from(h(phone + code.trim())), Buffer.from(row.codeHash));
  await db.update(otpCodes).set(good ? { consumed: true } : { attempts: row.attempts + 1 }).where(eq(otpCodes.id, row.id));
  if (!good) throw new AuthError("wrong_code", "That code is not right. Please try again.");
  let [user] = await db.select().from(users).where(eq(users.phone, phone));
  const isNew = !user;
  if (!user) [user] = await db.insert(users).values({ phone, name: name?.trim() || "New user" }).returning();
  const token = randomBytes(32).toString("base64url");
  await db.insert(authSessions).values({ id: h(token), userId: user.id, expiresAt: new Date(Date.now() + 30 * 864e5) });
  return { token, userId: user.id, isNew };
}
async function sessionUser(token) {
  if (!token) return null;
  const [s] = await db.select().from(authSessions).where(and(eq(authSessions.id, h(token)), gt(authSessions.expiresAt, /* @__PURE__ */ new Date())));
  if (!s) return null;
  const [u] = await db.select().from(users).where(eq(users.id, s.userId));
  return u ?? null;
}
const endSession = (token) => db.delete(authSessions).where(eq(authSessions.id, h(token)));
async function actorFor(userId, preferredSchool) {
  const [u] = await db.select().from(users).where(eq(users.id, userId));
  if (u?.isPlatformAdmin) return { id: userId, roles: ["platform_admin"], schoolId: null };
  const rows = await client`select school_id, role from user_memberships(${userId})`;
  const school = rows.find((r) => r.school_id === preferredSchool)?.school_id ?? rows[0]?.school_id ?? null;
  const roles = rows.filter((r) => r.school_id === school).map((r) => r.role);
  return { id: userId, roles, schoolId: school };
}
export {
  AuthError as A,
  actorFor as a,
  endSession as e,
  requestOtp as r,
  sessionUser as s,
  verifyOtp as v
};
