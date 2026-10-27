import { eq, and, desc, inArray } from "drizzle-orm";
import { F as Forbidden, a as can } from "./schools.js";
import { i as inSchool, s as schema } from "./db.js";
const {
  announcements,
  readReceipts,
  events,
  eventRsvps,
  requestTypes,
  parentRequests,
  requestStatusHistory,
  messageThreads,
  messages,
  parentChildLinks,
  enrolments,
  classes
} = schema;
const need = (a) => {
  if (!a.schoolId) throw new Forbidden();
  return a.schoolId;
};
async function myChildren(tx, guardianId) {
  return tx.select({ childId: parentChildLinks.childId, classId: enrolments.classId, level: classes.level, canMessage: parentChildLinks.canMessage }).from(parentChildLinks).leftJoin(enrolments, eq(enrolments.studentId, parentChildLinks.childId)).leftJoin(classes, eq(classes.id, enrolments.classId)).where(eq(parentChildLinks.guardianId, guardianId));
}
async function postNotice(actor, i) {
  const schoolId = need(actor);
  if (!can(actor, "notice.send", { schoolId })) throw new Forbidden();
  if (!i.title.trim() || !i.body.trim()) throw new RangeError("Add a title and a message");
  return inSchool(schoolId, async (tx) => {
    if (actor.roles.includes("teacher") && !actor.roles.some((r) => r === "school_admin" || r === "head_teacher")) {
      if (i.audience.kind !== "class") throw new Forbidden("Teachers can post to their own classes");
      const [c] = await tx.select().from(classes).where(eq(classes.id, i.audience.classId));
      if (!c || c.teacherId !== actor.id) throw new Forbidden("That is not your class");
    }
    const [n] = await tx.insert(announcements).values({ schoolId, authorId: actor.id, title: i.title.trim(), body: i.body.trim(), priority: i.priority ?? "normal", audience: i.audience, sendAt: i.sendAt, verse: i.verse }).returning();
    return n;
  });
}
async function noticesForGuardian(actor, now = /* @__PURE__ */ new Date()) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const kids = await myChildren(tx, actor.id);
    if (!kids.length) throw new Forbidden();
    const all = await tx.select().from(announcements).orderBy(desc(announcements.id));
    const reads = new Set((await tx.select().from(readReceipts).where(eq(readReceipts.userId, actor.id))).map((r) => r.announcementId));
    return all.filter((n) => !n.sendAt || n.sendAt <= now).filter((n) => {
      const a = n.audience;
      return a.kind === "school" || a.kind === "level" && kids.some((k) => k.level === a.level) || a.kind === "class" && kids.some((k) => k.classId === a.classId) || a.kind === "family" && kids.some((k) => k.childId === a.childId);
    }).map((n) => ({ id: n.id, title: n.title, body: n.body, priority: n.priority, verse: n.verse, read: reads.has(n.id) }));
  });
}
async function markRead(actor, announcementId) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const visible = (await noticesForGuardianTx(tx, actor)).some((n) => n.id === announcementId);
    if (!visible) throw new Forbidden();
    await tx.insert(readReceipts).values({ schoolId, announcementId, userId: actor.id }).onConflictDoNothing();
  });
}
async function noticesForGuardianTx(tx, actor) {
  const kids = await myChildren(tx, actor.id);
  const all = await tx.select().from(announcements);
  return all.filter((n) => {
    const a = n.audience;
    return a.kind === "school" || a.kind === "level" && kids.some((k) => k.level === a.level) || a.kind === "class" && kids.some((k) => k.classId === a.classId) || a.kind === "family" && kids.some((k) => k.childId === a.childId);
  });
}
async function createEvent(actor, i) {
  const schoolId = need(actor);
  if (!can(actor, "notice.send", { schoolId })) throw new Forbidden();
  return inSchool(schoolId, async (tx) => (await tx.insert(events).values({ schoolId, ...i }).returning())[0]);
}
const listEvents = async (actor) => {
  const s = need(actor);
  return inSchool(s, (tx) => tx.select().from(events).orderBy(events.startsAt));
};
async function rsvp(actor, eventId, childId, response, now = /* @__PURE__ */ new Date()) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const [link] = await tx.select().from(parentChildLinks).where(and(eq(parentChildLinks.guardianId, actor.id), eq(parentChildLinks.childId, childId)));
    if (!link) throw new Forbidden();
    const [e] = await tx.select().from(events).where(eq(events.id, eventId));
    if (!e) throw new Forbidden("Event not found");
    if (e.rsvpDeadline && now > e.rsvpDeadline) throw new RangeError("The deadline for replying has passed");
    if (response === "consent" && !e.needsConsent) throw new RangeError("This event does not need consent");
    await tx.insert(eventRsvps).values({ schoolId, eventId, guardianId: actor.id, childId, response }).onConflictDoUpdate({ target: [eventRsvps.eventId, eventRsvps.guardianId, eventRsvps.childId], set: { response } });
  });
}
function icsFor(e) {
  const f = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s) => s.replace(/[\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Classroom//EN", "BEGIN:VEVENT", `UID:${e.id}@classroom`, `DTSTAMP:${f(/* @__PURE__ */ new Date())}`, `DTSTART:${f(e.startsAt)}`, `DTEND:${f(new Date(e.startsAt.getTime() + 36e5))}`, `SUMMARY:${esc(e.title)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}
const BUILTIN_REQUEST_TYPES = ["Absence or leave", "Early pick-up", "Appointment", "Permission slip", "Document request", "Fee query", "Feedback or complaint"];
async function ensureRequestTypes(schoolId) {
  return inSchool(schoolId, async (tx) => {
    const have = new Set((await tx.select().from(requestTypes)).map((t) => t.name));
    for (const name of BUILTIN_REQUEST_TYPES) if (!have.has(name)) await tx.insert(requestTypes).values({ schoolId, name, builtin: true });
    return tx.select().from(requestTypes);
  });
}
const ORDER = ["submitted", "seen", "in_progress", "resolved"];
async function submitRequest(actor, typeId, childId, body, clientKey) {
  const schoolId = need(actor);
  if (!body.trim()) throw new RangeError("Please write your request");
  return inSchool(schoolId, async (tx) => {
    const [link] = await tx.select().from(parentChildLinks).where(and(eq(parentChildLinks.guardianId, actor.id), eq(parentChildLinks.childId, childId)));
    if (!link) throw new Forbidden();
    const [r] = await tx.insert(parentRequests).values({ schoolId, typeId, guardianId: actor.id, childId, body: body.trim(), clientKey }).onConflictDoNothing().returning();
    if (!r) return (await tx.select().from(parentRequests).where(eq(parentRequests.clientKey, clientKey)))[0];
    await tx.insert(requestStatusHistory).values({ schoolId, requestId: r.id, status: "submitted", actorId: actor.id });
    return r;
  });
}
async function requestInbox(actor) {
  const schoolId = need(actor);
  if (!can(actor, "request.manage", { schoolId })) throw new Forbidden();
  return inSchool(schoolId, (tx) => tx.select().from(parentRequests).orderBy(desc(parentRequests.id)));
}
async function updateRequest(actor, requestId, status, note, assigneeId) {
  const schoolId = need(actor);
  if (!can(actor, "request.manage", { schoolId })) throw new Forbidden();
  return inSchool(schoolId, async (tx) => {
    const [r] = await tx.select().from(parentRequests).where(eq(parentRequests.id, requestId));
    if (!r) throw new Forbidden("Request not found");
    if (ORDER.indexOf(status) < ORDER.indexOf(r.status)) throw new RangeError("A request cannot move back");
    await tx.update(parentRequests).set({ status, ...{} }).where(eq(parentRequests.id, requestId));
    await tx.insert(requestStatusHistory).values({ schoolId, requestId, status, actorId: actor.id, note });
  });
}
async function myRequests(actor) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const rows = await tx.select().from(parentRequests).where(eq(parentRequests.guardianId, actor.id));
    const hist = rows.length ? await tx.select().from(requestStatusHistory).where(inArray(requestStatusHistory.requestId, rows.map((r) => r.id))) : [];
    return rows.map((r) => ({ ...r, trail: hist.filter((h) => h.requestId === r.id).sort((a, b) => +a.at - +b.at).map((h) => ({ status: h.status, note: h.note, at: h.at })) }));
  });
}
async function sendMessage(actor, i, clientKey) {
  const schoolId = need(actor);
  if (!i.body.trim()) throw new RangeError("Write a message");
  return inSchool(schoolId, async (tx) => {
    const kids = await myChildren(tx, actor.id);
    const isGuardian = kids.some((k) => k.childId === i.childId && k.canMessage);
    const [cls] = await tx.select({ teacherId: classes.teacherId }).from(enrolments).innerJoin(classes, eq(classes.id, enrolments.classId)).where(eq(enrolments.studentId, i.childId));
    const isTeacher = cls?.teacherId === actor.id;
    const isOffice = can(actor, "message.audit", { schoolId });
    if (!(isGuardian || isTeacher || isOffice) || !can(actor, "message.send", { schoolId, childId: i.childId, isSelf: false, guardianFlags: { canPay: false, canViewResults: false, canMessage: isGuardian, mayCollect: false } }) && !isTeacher && !isOffice) throw new Forbidden();
    let threadId = i.threadId;
    if (!threadId) threadId = (await tx.insert(messageThreads).values({ schoolId, kind: i.kind, childId: i.childId }).returning())[0].id;
    else {
      const [t] = await tx.select().from(messageThreads).where(eq(messageThreads.id, threadId));
      if (!t || t.childId !== i.childId) throw new Forbidden();
    }
    const [m] = await tx.insert(messages).values({ schoolId, threadId, senderId: actor.id, body: i.body.trim(), clientKey }).onConflictDoNothing().returning();
    return m ?? (await tx.select().from(messages).where(eq(messages.clientKey, clientKey)))[0];
  });
}
async function readThread(actor, threadId) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const [t] = await tx.select().from(messageThreads).where(eq(messageThreads.id, threadId));
    if (!t) throw new Forbidden();
    const kids = await myChildren(tx, actor.id);
    const [cls] = await tx.select({ teacherId: classes.teacherId }).from(enrolments).innerJoin(classes, eq(classes.id, enrolments.classId)).where(eq(enrolments.studentId, t.childId));
    const ok = kids.some((k) => k.childId === t.childId && k.canMessage) || cls?.teacherId === actor.id || can(actor, "message.audit", { schoolId });
    if (!ok) throw new Forbidden();
    return tx.select().from(messages).where(eq(messages.threadId, threadId)).orderBy(messages.created);
  });
}
async function reportMessage(actor, messageId) {
  const schoolId = need(actor);
  return inSchool(schoolId, async (tx) => {
    const [m] = await tx.select().from(messages).where(eq(messages.id, messageId));
    if (!m) throw new Forbidden();
    await readThread(actor, m.threadId);
    await tx.update(messages).set({ reportedAt: /* @__PURE__ */ new Date() }).where(eq(messages.id, messageId));
  });
}
export {
  readThread as a,
  submitRequest as b,
  rsvp as c,
  markRead as d,
  ensureRequestTypes as e,
  requestInbox as f,
  createEvent as g,
  icsFor as i,
  listEvents as l,
  myRequests as m,
  noticesForGuardian as n,
  postNotice as p,
  reportMessage as r,
  sendMessage as s,
  updateRequest as u
};
