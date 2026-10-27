import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { eq } from 'drizzle-orm';
import { client, db, schema, inSchool } from './db';
import { requestOtp, verifyOtp, actorFor, AuthError } from './auth';
import { setSmsProvider } from './sms';
import { registerSchool, verifySchool, resolveJoin, createJoinRequest, decideJoinRequest, listJoinRequests, createClass, posterPdf, Forbidden } from './schools';

const sent: Record<string, string> = {};
const phone = () => '+2567' + String(Math.floor(Math.random() * 1e8)).padStart(8, '0');
async function login(p: string, name = 'T') {
  await requestOtp(p); const code = sent[p.replace(/\D/g, '')]!;
  return verifyOtp(p, code, name);
}
beforeAll(() => setSmsProvider({ async send(to, text) { sent[to.replace(/\D/g, '')] = text.match(/\d{6}/)![0]; } }));
afterAll(() => client.end());

describe('onboarding', () => {
  it('registers, verifies, joins by code only after approval; QR alone grants nothing', async () => {
    const admin = await login(phone(), 'Head');
    const reg = await registerSchool({ name: 'Test PS', district: 'Kampala', levelFrom: 'P1', levelTo: 'P7', contactPhone: '+256700000000', adminUserId: admin.userId });
    // unverified school cannot be joined
    expect(await resolveJoin({ code: reg.joinCode })).toBeNull();

    const platform = await login(phone(), 'Platform');
    await db.update(schema.users).set({ isPlatformAdmin: true }).where(eq(schema.users.id, platform.userId));
    // platform admin acts with schoolId null
    const pAct = await actorFor(platform.userId);
    const sAdmin = await actorFor(admin.userId);
    await expect(verifySchool(sAdmin, reg.schoolId, true)).rejects.toThrow(Forbidden);
    await verifySchool(pAct, reg.schoolId, true);

    const byCode = await resolveJoin({ code: reg.joinCode.toLowerCase().replace('-', ' ') });
    const byQr = await resolveJoin({ qr: reg.qrToken });
    expect(byCode?.schoolId).toBe(reg.schoolId); expect(byQr?.schoolId).toBe(reg.schoolId);
    expect(await resolveJoin({ qr: 'not-a-token' })).toBeNull();

    const cls = await createClass(sAdmin, 'P5 Blue', 'P5');
    const viaClass = await resolveJoin({ code: cls.joinCode });
    expect(viaClass?.classId).toBe(cls.id);

    const parent = await login(phone(), 'Parent');
    const pa = await actorFor(parent.userId);
    expect(pa.schoolId).toBeNull();                       // scanning gives no membership
    const jr = await createJoinRequest(pa, viaClass!, 'Amina');
    expect((await actorFor(parent.userId)).schoolId).toBeNull(); // still nothing while pending
    await expect(listJoinRequests(pa)).rejects.toThrow(Forbidden);

    const pending = await listJoinRequests(sAdmin);
    expect(pending.map((r) => r.id)).toContain(jr.id);
    const childId = await decideJoinRequest(sAdmin, jr.id, true);
    const after = await actorFor(parent.userId);
    expect(after.schoolId).toBe(reg.schoolId); expect(after.roles).toContain('guardian');
    const links = await inSchool(reg.schoolId, (tx) => tx.select().from(schema.parentChildLinks).where(eq(schema.parentChildLinks.childId, childId!)));
    expect(links).toHaveLength(1);
    const consent = await inSchool(reg.schoolId, (tx) => tx.select().from(schema.consentLog));
    expect(consent.length).toBeGreaterThan(0);
    await expect(decideJoinRequest(sAdmin, jr.id, true)).rejects.toThrow(); // cannot decide twice
  });

  it('another school admin cannot see or decide this school’s requests', async () => {
    const a1 = await login(phone()), a2 = await login(phone());
    const s1 = await registerSchool({ name: 'S1', district: 'x', levelFrom: 'P1', levelTo: 'P7', contactPhone: '+256700000001', adminUserId: a1.userId });
    const s2 = await registerSchool({ name: 'S2', district: 'x', levelFrom: 'P1', levelTo: 'P7', contactPhone: '+256700000002', adminUserId: a2.userId });
    const p = await login(phone());
    await db.update(schema.schools).set({ verifyStatus: 'verified' }).where(eq(schema.schools.id, s1.schoolId));
    const jr = await createJoinRequest(await actorFor(p.userId), (await resolveJoin({ code: s1.joinCode }))!, 'Kid');
    const other = await actorFor(a2.userId);
    expect(other.schoolId).toBe(s2.schoolId);
    expect(await listJoinRequests(other)).toHaveLength(0);
    await expect(decideJoinRequest(other, jr.id, true)).rejects.toThrow();
  });
});

describe('otp', () => {
  it('rejects wrong codes, locks after 5 tries, rate limits requests', async () => {
    const p = phone();
    await requestOtp(p);
    for (let i = 0; i < 5; i++) await expect(verifyOtp(p, '000000')).rejects.toThrow(AuthError);
    await expect(verifyOtp(p, sent[p.replace(/\D/g, '')]!)).rejects.toMatchObject({ code: 'locked' });
    await requestOtp(p); await requestOtp(p);
    await expect(requestOtp(p)).rejects.toMatchObject({ code: 'rate_limited' });
  });
  it('rejects non-Ugandan numbers', async () => { await expect(requestOtp('12345')).rejects.toMatchObject({ code: 'bad_phone' }); });
});

describe('poster', () => {
  it('renders a one-page PDF', async () => {
    const pdf = await posterPdf('https://example.org', 'Test PS', 'AAAA-BBBB');
    expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
    expect((pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length).toBe(1);
  });
});
