import { and, desc, eq, inArray } from 'drizzle-orm';
import { can, type Actor, type Priority } from '@classroom/core';
import { inSchool, schema, type Tx } from './db';
import { Forbidden } from './schools';

const { announcements, readReceipts, events, eventRsvps, requestTypes, parentRequests, requestStatusHistory, messageThreads, messages,
  parentChildLinks, enrolments, classes, notificationPreferences, userRoles, users } = schema;

export type Audience = { kind: 'school' } | { kind: 'level'; level: string } | { kind: 'class'; classId: string } | { kind: 'family'; childId: string };
const need = (a: Actor) => { if (!a.schoolId) throw new Forbidden(); return a.schoolId; };

/** Children a guardian is linked to, with the class and level of each. */
async function myChildren(tx: Tx, guardianId: string) {
  return tx.select({ childId: parentChildLinks.childId, classId: enrolments.classId, level: classes.level, canMessage: parentChildLinks.canMessage })
    .from(parentChildLinks).leftJoin(enrolments, eq(enrolments.studentId, parentChildLinks.childId)).leftJoin(classes, eq(classes.id, enrolments.classId)).where(eq(parentChildLinks.guardianId, guardianId));
}

// ---------- Notices ----------
export async function postNotice(actor: Actor, i: { title: string; body: string; priority?: Priority; audience: Audience; sendAt?: Date; verse?: string }) {
  const schoolId = need(actor);
  if (!can(actor, 'notice.send', { schoolId })) throw new Forbidden();
  if (!i.title.trim() || !i.body.trim()) throw new RangeError('Add a title and a message');
  return inSchool(schoolId, async (tx) => {
    if (actor.roles.includes('teacher') && !actor.roles.some((r) => r === 'school_admin' || r === 'head_teacher')) {
      // Teachers may only write to their own classes.
      if (i.audience.kind !== 'class') throw new Forbidden('Teachers can post to their own classes');
      const [c] = await tx.select().from(classes).where(eq(classes.id, i.audience.classId));
      if (!c || c.teacherId !== actor.id) throw new Forbidden('That is not your class');
    }
    const [n] = await tx.insert(announcements).values({ schoolId, authorId: actor.id, title: i.title.trim(), body: i.body.trim(), priority: i.priority ?? 'normal', audience: i.audience, sendAt: i.sendAt, verse: i.verse }).returning();
    return n!;
  });
}

/** Notices a guardian should see: school-wide, their children's levels/classes, and ones addressed to their family. Scheduled sends appear only once due. */
export async function noticesForGuardian(actor: Actor, now = new Date()) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const kids = await myChildren(tx, actor.id);
    if (!kids.length) throw new Forbidden();
    const all = await tx.select().from(announcements).orderBy(desc(announcements.id));
    const reads = new Set((await tx.select().from(readReceipts).where(eq(readReceipts.userId, actor.id))).map((r) => r.announcementId));
    return all.filter((n) => !n.sendAt || n.sendAt <= now).filter((n) => {
      const a = n.audience as Audience;
      return a.kind === 'school' || (a.kind === 'level' && kids.some((k) => k.level === a.level)) || (a.kind === 'class' && kids.some((k) => k.classId === a.classId)) || (a.kind === 'family' && kids.some((k) => k.childId === a.childId));
    }).map((n) => ({ id: n.id, title: n.title, body: n.body, priority: n.priority, verse: n.verse, read: reads.has(n.id) }));
  });
}
export async function markRead(actor: Actor, announcementId: string) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    // Only notices this person could see can be marked read.
    const visible = (await noticesForGuardianTx(tx, actor)).some((n) => n.id === announcementId);
    if (!visible) throw new Forbidden();
    await tx.insert(readReceipts).values({ schoolId, announcementId, userId: actor.id }).onConflictDoNothing();
  });
}
async function noticesForGuardianTx(tx: Tx, actor: Actor) {
  const kids = await myChildren(tx, actor.id);
  const all = await tx.select().from(announcements);
  return all.filter((n) => { const a = n.audience as Audience; return a.kind === 'school' || (a.kind === 'level' && kids.some((k) => k.level === a.level)) || (a.kind === 'class' && kids.some((k) => k.classId === a.classId)) || (a.kind === 'family' && kids.some((k) => k.childId === a.childId)); });
}
/** Staff delivery/read report: counts only. Names of who has not read are shown to staff, never to other parents. */
export async function readReport(actor: Actor, announcementId: string) {
  const schoolId = need(actor);
  if (!can(actor, 'notice.send', { schoolId })) throw new Forbidden();
  return inSchool(schoolId, async (tx) => {
    const reads = await tx.select().from(readReceipts).where(eq(readReceipts.announcementId, announcementId));
    return { readCount: reads.length };
  });
}

// ---------- Events ----------
export async function createEvent(actor: Actor, i: { title: string; kind: string; startsAt: Date; rsvpDeadline?: Date; needsConsent?: boolean }) {
  const schoolId = need(actor);
  if (!can(actor, 'notice.send', { schoolId })) throw new Forbidden();
  return inSchool(schoolId, async (tx) => (await tx.insert(events).values({ schoolId, ...i }).returning())[0]!);
}
export const listEvents = async (actor: Actor) => { const s = need(actor); return inSchool(s, (tx) => tx.select().from(events).orderBy(events.startsAt)); };

export async function rsvp(actor: Actor, eventId: string, childId: string, response: 'yes' | 'no' | 'consent', now = new Date()) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const [link] = await tx.select().from(parentChildLinks).where(and(eq(parentChildLinks.guardianId, actor.id), eq(parentChildLinks.childId, childId)));
    if (!link) throw new Forbidden();
    const [e] = await tx.select().from(events).where(eq(events.id, eventId));
    if (!e) throw new Forbidden('Event not found');
    if (e.rsvpDeadline && now > e.rsvpDeadline) throw new RangeError('The deadline for replying has passed');
    if (response === 'consent' && !e.needsConsent) throw new RangeError('This event does not need consent');
    await tx.insert(eventRsvps).values({ schoolId, eventId, guardianId: actor.id, childId, response }).onConflictDoUpdate({ target: [eventRsvps.eventId, eventRsvps.guardianId, eventRsvps.childId], set: { response } });
  });
}

/** iCalendar file for "Add to phone calendar". */
export function icsFor(e: { id: string; title: string; startsAt: Date }): string {
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const esc = (s: string) => s.replace(/[\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Classroom//EN', 'BEGIN:VEVENT', `UID:${e.id}@classroom`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(e.startsAt)}`, `DTEND:${f(new Date(e.startsAt.getTime() + 3600_000))}`, `SUMMARY:${esc(e.title)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}

// ---------- Requests ----------
export const BUILTIN_REQUEST_TYPES = ['Absence or leave', 'Early pick-up', 'Appointment', 'Permission slip', 'Document request', 'Fee query', 'Feedback or complaint'];
export async function ensureRequestTypes(schoolId: string) {
  return inSchool(schoolId, async (tx) => {
    const have = new Set((await tx.select().from(requestTypes)).map((t) => t.name));
    for (const name of BUILTIN_REQUEST_TYPES) if (!have.has(name)) await tx.insert(requestTypes).values({ schoolId, name, builtin: true });
    return tx.select().from(requestTypes);
  });
}
export async function addRequestType(actor: Actor, name: string) {
  const schoolId = need(actor);
  if (!can(actor, 'request.manage', { schoolId })) throw new Forbidden();
  return inSchool(schoolId, async (tx) => (await tx.insert(requestTypes).values({ schoolId, name: name.trim() }).returning())[0]!);
}
const ORDER = ['submitted', 'seen', 'in_progress', 'resolved'] as const;

export async function submitRequest(actor: Actor, typeId: string, childId: string, body: string, clientKey: string) {
  const schoolId = need(actor);
  if (!body.trim()) throw new RangeError('Please write your request');
  return inSchool(schoolId, async (tx) => {
    const [link] = await tx.select().from(parentChildLinks).where(and(eq(parentChildLinks.guardianId, actor.id), eq(parentChildLinks.childId, childId)));
    if (!link) throw new Forbidden();
    const [r] = await tx.insert(parentRequests).values({ schoolId, typeId, guardianId: actor.id, childId, body: body.trim(), clientKey }).onConflictDoNothing().returning();
    if (!r) return (await tx.select().from(parentRequests).where(eq(parentRequests.clientKey, clientKey)))[0]!;
    await tx.insert(requestStatusHistory).values({ schoolId, requestId: r.id, status: 'submitted', actorId: actor.id });
    return r;
  });
}

export async function requestInbox(actor: Actor) {
  const schoolId = need(actor);
  if (!can(actor, 'request.manage', { schoolId })) throw new Forbidden();
  return inSchool(schoolId, (tx) => tx.select().from(parentRequests).orderBy(desc(parentRequests.id)));
}
/** Staff move a request forward (never backwards) and may assign it. Each change is recorded in the trail. */
export async function updateRequest(actor: Actor, requestId: string, status: (typeof ORDER)[number], note?: string, assigneeId?: string) {
  const schoolId = need(actor);
  if (!can(actor, 'request.manage', { schoolId })) throw new Forbidden();
  return inSchool(schoolId, async (tx) => {
    const [r] = await tx.select().from(parentRequests).where(eq(parentRequests.id, requestId));
    if (!r) throw new Forbidden('Request not found');
    if (ORDER.indexOf(status) < ORDER.indexOf(r.status)) throw new RangeError('A request cannot move back');
    await tx.update(parentRequests).set({ status, ...(assigneeId ? { assigneeId } : {}) }).where(eq(parentRequests.id, requestId));
    await tx.insert(requestStatusHistory).values({ schoolId, requestId, status, actorId: actor.id, note });
  });
}
export async function myRequests(actor: Actor) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const rows = await tx.select().from(parentRequests).where(eq(parentRequests.guardianId, actor.id));
    const hist = rows.length ? await tx.select().from(requestStatusHistory).where(inArray(requestStatusHistory.requestId, rows.map((r) => r.id))) : [];
    return rows.map((r) => ({ ...r, trail: hist.filter((h) => h.requestId === r.id).sort((a, b) => +a.at - +b.at).map((h) => ({ status: h.status, note: h.note, at: h.at })) }));
  });
}

// ---------- Messages: always visible to school administration. No private channels. ----------
export async function sendMessage(actor: Actor, i: { childId: string; kind: 'parent_teacher' | 'parent_office'; body: string; threadId?: string }, clientKey: string) {
  const schoolId = need(actor);
  if (!i.body.trim()) throw new RangeError('Write a message');
  return inSchool(schoolId, async (tx) => {
    const kids = await myChildren(tx, actor.id);
    const isGuardian = kids.some((k) => k.childId === i.childId && k.canMessage);
    const [cls] = await tx.select({ teacherId: classes.teacherId }).from(enrolments).innerJoin(classes, eq(classes.id, enrolments.classId)).where(eq(enrolments.studentId, i.childId));
    const isTeacher = cls?.teacherId === actor.id;
    const isOffice = can(actor, 'message.audit', { schoolId });
    if (!(isGuardian || isTeacher || isOffice) || !can(actor, 'message.send', { schoolId, childId: i.childId, isSelf: false, guardianFlags: { canPay: false, canViewResults: false, canMessage: isGuardian, mayCollect: false } }) && !isTeacher && !isOffice) throw new Forbidden();
    let threadId = i.threadId;
    if (!threadId) threadId = (await tx.insert(messageThreads).values({ schoolId, kind: i.kind, childId: i.childId }).returning())[0]!.id;
    else { const [t] = await tx.select().from(messageThreads).where(eq(messageThreads.id, threadId)); if (!t || t.childId !== i.childId) throw new Forbidden(); }
    const [m] = await tx.insert(messages).values({ schoolId, threadId, senderId: actor.id, body: i.body.trim(), clientKey }).onConflictDoNothing().returning();
    return m ?? (await tx.select().from(messages).where(eq(messages.clientKey, clientKey)))[0]!;
  });
}
/** Participants (linked guardians with canMessage, the class teacher) and office staff may read a thread. */
export async function readThread(actor: Actor, threadId: string) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const [t] = await tx.select().from(messageThreads).where(eq(messageThreads.id, threadId));
    if (!t) throw new Forbidden();
    const kids = await myChildren(tx, actor.id);
    const [cls] = await tx.select({ teacherId: classes.teacherId }).from(enrolments).innerJoin(classes, eq(classes.id, enrolments.classId)).where(eq(enrolments.studentId, t.childId!));
    const ok = kids.some((k) => k.childId === t.childId && k.canMessage) || cls?.teacherId === actor.id || can(actor, 'message.audit', { schoolId });
    if (!ok) throw new Forbidden();
    return tx.select().from(messages).where(eq(messages.threadId, threadId)).orderBy(messages.created);
  });
}
export async function reportMessage(actor: Actor, messageId: string) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const [m] = await tx.select().from(messages).where(eq(messages.id, messageId));
    if (!m) throw new Forbidden();
    await readThread(actor, m.threadId);                       // must be able to see it to report it
    await tx.update(messages).set({ reportedAt: new Date() }).where(eq(messages.id, messageId));
  });
}
export async function reportedMessages(actor: Actor) {
  const schoolId = need(actor);
  if (!can(actor, 'message.audit', { schoolId })) throw new Forbidden();
  return inSchool(schoolId, async (tx) => (await tx.select().from(messages)).filter((m) => m.reportedAt));
}

export async function setPreferences(actor: Actor, p: { channel?: string; language?: string; quietFrom?: string | null; quietTo?: string | null; smsConsent?: boolean }) {
  await need(actor);
  const [u] = await (await import('./db')).db.select().from(users).where(eq(users.id, actor.id));
  if (!u) throw new Forbidden();
  await (await import('./db')).db.insert(notificationPreferences).values({ userId: actor.id, ...p }).onConflictDoUpdate({ target: notificationPreferences.userId, set: p });
}
void userRoles;
