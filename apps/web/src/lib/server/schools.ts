import { createHash } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { can, shortCode, qrToken, normaliseCode, type Actor } from '@classroom/core';
import { client, db, inSchool, schema } from './db';

const { schools, schoolSettings, userRoles, joinRequests, parentChildLinks, enrolments, users, auditLog, consentLog, classes } = schema;
export class Forbidden extends Error { constructor(m = 'Not allowed') { super(m); } }
const qrHash = (t: string) => createHash('sha256').update(t).digest('hex');

export interface RegisterInput { name: string; district: string; levelFrom: string; levelTo: string; contactPhone: string; adminUserId: string; faith?: 'full' | 'light' | 'off'; languages?: string[] }

/** A school registers; the registering user becomes school admin. Status stays `pending` until a platform admin verifies. */
export async function registerSchool(i: RegisterInput) {
  const id = crypto.randomUUID(); const token = qrToken(); const code = shortCode();
  await inSchool(id, async (tx) => {
    await tx.insert(schools).values({ id, name: i.name.trim(), district: i.district.trim(), levelFrom: i.levelFrom, levelTo: i.levelTo, contactPhone: i.contactPhone, qrTokenHash: qrHash(token), joinCode: code });
    await tx.insert(schoolSettings).values({ schoolId: id, faith: i.faith ?? 'light', languages: i.languages ?? ['en'] });
    await tx.insert(userRoles).values({ userId: i.adminUserId, schoolId: id, role: 'school_admin' });
    await tx.insert(auditLog).values({ schoolId: id, actorId: i.adminUserId, action: 'school.register', target: id });
  });
  return { schoolId: id, joinCode: code, qrToken: token }; // token is shown once (poster); only its hash is stored
}

export async function verifySchool(actor: Actor, schoolId: string, approve: boolean) {
  if (!can(actor, 'school.verify', { schoolId })) throw new Forbidden();
  await db.update(schools).set({ verifyStatus: approve ? 'verified' : 'rejected' }).where(eq(schools.id, schoolId));
  await inSchool(schoolId, (tx) => tx.insert(auditLog).values({ schoolId, actorId: actor.id, action: approve ? 'school.verify' : 'school.reject', target: schoolId }));
}

export const pendingSchools = () => db.select().from(schools).where(eq(schools.verifyStatus, 'pending'));

export interface Resolved { schoolId: string; schoolName: string; classId: string | null; className: string | null }

/** Resolve a short code or QR token to a school/class. Grants NOTHING: it only says where a join request would go. */
export async function resolveJoin(input: { code?: string; qr?: string }): Promise<Resolved | null> {
  let rows: any;
  if (input.qr) rows = await client`select * from school_by_qr_hash(${qrHash(input.qr)})`.then((r) => r.map((x) => ({ ...x, class_id: null, class_name: null })));
  else if (input.code) rows = await client`select * from resolve_join_code(${normaliseCode(input.code)})`;
  else return null;
  // Class codes are stored as typed ("C1"), school codes normalised; try raw as well.
  if (!rows?.length && input.code) rows = await client`select * from resolve_join_code(${input.code.trim().toUpperCase()})`;
  const r = rows?.[0];
  if (!r || !r.verified) return null; // unverified schools cannot be joined
  return { schoolId: r.school_id, schoolName: r.school_name, classId: r.class_id, className: r.class_name };
}

/** Guardian asks to link a child. Creates a PENDING request only. */
export async function createJoinRequest(actor: Actor, target: Resolved, childName: string) {
  if (!can(actor, 'join.request.create', { schoolId: target.schoolId })) throw new Forbidden();
  return inSchool(target.schoolId, async (tx) => {
    const [r] = await tx.insert(joinRequests).values({ schoolId: target.schoolId, guardianId: actor.id, childName: childName.trim(), classId: target.classId }).returning();
    return r!;
  });
}

export const listJoinRequests = async (actor: Actor) => {
  if (!actor.schoolId || !can(actor, 'join.request.decide', { schoolId: actor.schoolId })) throw new Forbidden();
  return inSchool(actor.schoolId, (tx) => tx.select().from(joinRequests).where(eq(joinRequests.status, 'pending')));
};

/** School admin decides. Approval creates the child user, the guardian link, roles, enrolment and a consent record. */
export async function decideJoinRequest(actor: Actor, requestId: string, approve: boolean) {
  if (!actor.schoolId || !can(actor, 'join.request.decide', { schoolId: actor.schoolId })) throw new Forbidden();
  const schoolId = actor.schoolId;
  return inSchool(schoolId, async (tx) => {
    const [req] = await tx.select().from(joinRequests).where(and(eq(joinRequests.id, requestId), eq(joinRequests.status, 'pending')));
    if (!req) throw new Forbidden('Request not found or already decided');
    await tx.update(joinRequests).set({ status: approve ? 'approved' : 'rejected', decidedBy: actor.id, decidedAt: new Date() }).where(eq(joinRequests.id, req.id));
    await tx.insert(auditLog).values({ schoolId, actorId: actor.id, action: approve ? 'join.approve' : 'join.reject', target: req.id });
    if (!approve) return null;
    const [child] = await tx.insert(users).values({ name: req.childName }).returning();
    await tx.insert(userRoles).values([{ userId: child!.id, schoolId, role: 'student' }, { userId: req.guardianId, schoolId, role: 'guardian' }]).onConflictDoNothing();
    await tx.insert(parentChildLinks).values({ schoolId, guardianId: req.guardianId, childId: child!.id, canPay: true, canViewResults: true, canMessage: true, mayCollect: true });
    if (req.classId) await tx.insert(enrolments).values({ schoolId, classId: req.classId, studentId: child!.id });
    await tx.insert(consentLog).values({ schoolId, subjectId: child!.id, givenBy: req.guardianId, purpose: 'child_account_and_learning_data' });
    return child!.id;
  });
}

export async function createClass(actor: Actor, name: string, level: string) {
  if (!actor.schoolId || !can(actor, 'class.manage', { schoolId: actor.schoolId })) throw new Forbidden();
  return inSchool(actor.schoolId, async (tx) => {
    const [c] = await tx.insert(classes).values({ schoolId: actor.schoolId!, name, level, joinCode: shortCode(6) }).returning();
    return c!;
  });
}

/** One-page A4 poster: school name, QR , short code, how to start. The QR alone never grants access. */
export async function posterPdf(origin: string, schoolName: string, code: string): Promise<Buffer> {
  // The QR carries the join code (reprintable any time). It only opens the join form; approval is still required.
  const png = await QRCode.toBuffer(`${origin}/join?c=${encodeURIComponent(code)}`, { width: 600, margin: 1 });
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Buffer[] = []; doc.on('data', (c) => chunks.push(c));
  const done = new Promise<Buffer>((r) => doc.on('end', () => r(Buffer.concat(chunks))));
  doc.rect(0, 0, 595, 120).fill('#0B6E4F');
  doc.fillColor('#fff').fontSize(30).text(schoolName, 50, 40, { width: 495, align: 'center' });
  doc.fillColor('#14213D').fontSize(22).text('Join Classroom', 50, 150, { align: 'center' });
  doc.image(png, 172, 190, { width: 250 });
  doc.fontSize(16).text(`Or enter the code: ${code}`, 50, 460, { align: 'center' });
  doc.fontSize(15).text('How to start', 80, 510, { underline: true });
  doc.fontSize(14).list(['Scan the code with your phone camera.', 'Enter your phone number and the code we text you.', 'Tell us your child\'s name.', 'Wait for the school to approve. Scanning alone does not give access.'], 80, 540, { width: 440 });
  doc.fontSize(11).fillColor('#555').text('Built on faith. Strengthened at home. Learning together.', 50, 750, { align: 'center' });
  doc.end(); return done;
}
