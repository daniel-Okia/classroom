import { eq } from 'drizzle-orm';
import { db, schema } from './db';
import { requestOtp, verifyOtp, actorFor } from './auth';
import { setSmsProvider } from './sms';
import { registerSchool, createClass, resolveJoin, createJoinRequest, decideJoinRequest } from './schools';

const sent: Record<string, string> = {};
export const useTestSms = () => setSmsProvider({ async send(to, t) { sent[to.replace(/\D/g, '')] = t.match(/\d{6}/)![0]; } });
export const phone = () => '+2567' + String(Math.floor(Math.random() * 1e8)).padStart(8, '0');
export async function login(p = phone(), name = 'T') { await requestOtp(p); return verifyOtp(p, sent[p.replace(/\D/g, '')]!, name); }

/** A verified school with an admin, a class (with a teacher) and one linked child + guardian. */
export async function seedSchool(childName = 'Amina') {
  useTestSms();
  const admin = await login(); const teacher = await login(); const guardian = await login();
  const reg = await registerSchool({ name: 'Seed School', district: 'Kampala', levelFrom: 'P1', levelTo: 'S6', contactPhone: '+256700000000', adminUserId: admin.userId });
  await db.update(schema.schools).set({ verifyStatus: 'verified' }).where(eq(schema.schools.id, reg.schoolId));
  const adminA = await actorFor(admin.userId);
  const cls = await createClass(adminA, 'S4 East', 'S4');
  const { inSchool } = await import('./db');
  await inSchool(reg.schoolId, async (tx) => {
    await tx.insert(schema.userRoles).values({ userId: teacher.userId, schoolId: reg.schoolId, role: 'teacher' });
    await tx.update(schema.classes).set({ teacherId: teacher.userId }).where(eq(schema.classes.id, cls.id));
  });
  const jr = await createJoinRequest(await actorFor(guardian.userId), (await resolveJoin({ code: cls.joinCode }))!, childName);
  const childId = (await decideJoinRequest(adminA, jr.id, true))!;
  return { reg, cls, adminId: admin.userId, teacherId: teacher.userId, guardianId: guardian.userId, childId, admin: adminA,
    teacher: await actorFor(teacher.userId), guardian: await actorFor(guardian.userId), child: { id: childId, roles: ['student' as const], schoolId: reg.schoolId } };
}
