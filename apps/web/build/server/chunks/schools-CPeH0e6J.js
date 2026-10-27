import { createHash, randomBytes } from 'node:crypto';
import { eq, and } from 'drizzle-orm';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { c as client, i as inSchool, s as schema, d as db } from './db-4b7EjHA-.js';

const ROLE_ACTIONS = {
  student: ["content.read", "progress.read", "message.send"],
  guardian: ["join.request.create", "content.read", "progress.read", "request.submit", "message.send", "fees.read", "payment.make", "results.read"],
  teacher: ["content.read", "progress.read", "task.assign", "submission.mark", "notice.send", "request.manage", "message.send", "results.write"],
  school_admin: ["school.settings.write", "join.request.decide", "class.manage", "package.manage", "content.read", "progress.read", "notice.send", "request.manage", "message.audit", "results.publish", "audit.read"],
  content_editor: ["content.read", "content.write", "content.publish"],
  platform_admin: ["school.verify", "audit.read"],
  bursar: ["fees.read", "fees.manage", "request.manage", "audit.read"],
  head_teacher: ["content.read", "progress.read", "notice.send", "request.manage", "message.audit", "results.read", "results.publish", "audit.read"]
};
const NEEDS_CHILD_LINK = {
  "fees.read": "canPay",
  "payment.make": "canPay",
  "results.read": "canViewResults",
  "progress.read": true,
  "message.send": "canMessage"
};
const FINANCE_ROLES = ["bursar", "head_teacher", "school_admin"];
function can(actor, action, res) {
  const platformOnly = action === "school.verify";
  if (!platformOnly) {
    if (actor.schoolId === null || res.schoolId === null || actor.schoolId !== res.schoolId) {
      return action === "join.request.create" && res.schoolId !== null && actor.schoolId === null;
    }
  } else {
    return actor.roles.includes("platform_admin");
  }
  return actor.roles.some((role) => {
    if (!ROLE_ACTIONS[role].includes(action)) return false;
    if (role === "guardian" || role === "student") {
      if (role === "student" && !res.isSelf) return false;
      if (role === "guardian") {
        const need = NEEDS_CHILD_LINK[action];
        if (need !== void 0) {
          if (!res.childId || !res.guardianFlags) return false;
          if (need !== true && !res.guardianFlags[need]) return false;
        }
      }
      return true;
    }
    if (role === "teacher") {
      const classScoped = ["progress.read", "task.assign", "submission.mark", "results.write"];
      if (classScoped.includes(action) && !res.actorTeachesClass) return false;
    }
    if (action === "fees.read" && !FINANCE_ROLES.includes(role)) return false;
    return true;
  });
}
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function shortCode(len = 8) {
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
    if (i === len / 2 - 1) out += "-";
  }
  return out;
}
const normaliseCode = (s) => s.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^(.{4})(.+)$/, "$1-$2");
const qrToken = () => randomBytes(16).toString("base64url");
const { schools, schoolSettings, userRoles, joinRequests, parentChildLinks, enrolments, users, auditLog, consentLog, classes } = schema;
class Forbidden extends Error {
  constructor(m = "Not allowed") {
    super(m);
  }
}
const qrHash = (t) => createHash("sha256").update(t).digest("hex");
async function registerSchool(i) {
  const id = crypto.randomUUID();
  const token = qrToken();
  const code = shortCode();
  await inSchool(id, async (tx) => {
    await tx.insert(schools).values({ id, name: i.name.trim(), district: i.district.trim(), levelFrom: i.levelFrom, levelTo: i.levelTo, contactPhone: i.contactPhone, qrTokenHash: qrHash(token), joinCode: code });
    await tx.insert(schoolSettings).values({ schoolId: id, faith: i.faith ?? "light", languages: i.languages ?? ["en"] });
    await tx.insert(userRoles).values({ userId: i.adminUserId, schoolId: id, role: "school_admin" });
    await tx.insert(auditLog).values({ schoolId: id, actorId: i.adminUserId, action: "school.register", target: id });
  });
  return { schoolId: id, joinCode: code, qrToken: token };
}
async function verifySchool(actor, schoolId, approve) {
  if (!can(actor, "school.verify", { schoolId })) throw new Forbidden();
  await db.update(schools).set({ verifyStatus: approve ? "verified" : "rejected" }).where(eq(schools.id, schoolId));
  await inSchool(schoolId, (tx) => tx.insert(auditLog).values({ schoolId, actorId: actor.id, action: approve ? "school.verify" : "school.reject", target: schoolId }));
}
const pendingSchools = () => db.select().from(schools).where(eq(schools.verifyStatus, "pending"));
async function resolveJoin(input) {
  let rows;
  if (input.qr) rows = await client`select * from school_by_qr_hash(${qrHash(input.qr)})`.then((r2) => r2.map((x) => ({ ...x, class_id: null, class_name: null })));
  else if (input.code) rows = await client`select * from resolve_join_code(${normaliseCode(input.code)})`;
  else return null;
  if (!rows?.length && input.code) rows = await client`select * from resolve_join_code(${input.code.trim().toUpperCase()})`;
  const r = rows?.[0];
  if (!r || !r.verified) return null;
  return { schoolId: r.school_id, schoolName: r.school_name, classId: r.class_id, className: r.class_name };
}
async function createJoinRequest(actor, target, childName) {
  if (!can(actor, "join.request.create", { schoolId: target.schoolId })) throw new Forbidden();
  return inSchool(target.schoolId, async (tx) => {
    const [r] = await tx.insert(joinRequests).values({ schoolId: target.schoolId, guardianId: actor.id, childName: childName.trim(), classId: target.classId }).returning();
    return r;
  });
}
const listJoinRequests = async (actor) => {
  if (!actor.schoolId || !can(actor, "join.request.decide", { schoolId: actor.schoolId })) throw new Forbidden();
  return inSchool(actor.schoolId, (tx) => tx.select().from(joinRequests).where(eq(joinRequests.status, "pending")));
};
async function decideJoinRequest(actor, requestId, approve) {
  if (!actor.schoolId || !can(actor, "join.request.decide", { schoolId: actor.schoolId })) throw new Forbidden();
  const schoolId = actor.schoolId;
  return inSchool(schoolId, async (tx) => {
    const [req] = await tx.select().from(joinRequests).where(and(eq(joinRequests.id, requestId), eq(joinRequests.status, "pending")));
    if (!req) throw new Forbidden("Request not found or already decided");
    await tx.update(joinRequests).set({ status: approve ? "approved" : "rejected", decidedBy: actor.id, decidedAt: /* @__PURE__ */ new Date() }).where(eq(joinRequests.id, req.id));
    await tx.insert(auditLog).values({ schoolId, actorId: actor.id, action: approve ? "join.approve" : "join.reject", target: req.id });
    if (!approve) return null;
    const [child] = await tx.insert(users).values({ name: req.childName }).returning();
    await tx.insert(userRoles).values([{ userId: child.id, schoolId, role: "student" }, { userId: req.guardianId, schoolId, role: "guardian" }]).onConflictDoNothing();
    await tx.insert(parentChildLinks).values({ schoolId, guardianId: req.guardianId, childId: child.id, canPay: true, canViewResults: true, canMessage: true, mayCollect: true });
    if (req.classId) await tx.insert(enrolments).values({ schoolId, classId: req.classId, studentId: child.id });
    await tx.insert(consentLog).values({ schoolId, subjectId: child.id, givenBy: req.guardianId, purpose: "child_account_and_learning_data" });
    return child.id;
  });
}
async function createClass(actor, name, level) {
  if (!actor.schoolId || !can(actor, "class.manage", { schoolId: actor.schoolId })) throw new Forbidden();
  return inSchool(actor.schoolId, async (tx) => {
    const [c] = await tx.insert(classes).values({ schoolId: actor.schoolId, name, level, joinCode: shortCode(6) }).returning();
    return c;
  });
}
async function posterPdf(origin, schoolName, code) {
  const png = await QRCode.toBuffer(`${origin}/join?c=${encodeURIComponent(code)}`, { width: 600, margin: 1 });
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise((r) => doc.on("end", () => r(Buffer.concat(chunks))));
  doc.rect(0, 0, 595, 120).fill("#0B6E4F");
  doc.fillColor("#fff").fontSize(30).text(schoolName, 50, 40, { width: 495, align: "center" });
  doc.fillColor("#14213D").fontSize(22).text("Join Classroom", 50, 150, { align: "center" });
  doc.image(png, 172, 190, { width: 250 });
  doc.fontSize(16).text(`Or enter the code: ${code}`, 50, 460, { align: "center" });
  doc.fontSize(15).text("How to start", 80, 510, { underline: true });
  doc.fontSize(14).list(["Scan the code with your phone camera.", "Enter your phone number and the code we text you.", "Tell us your child's name.", "Wait for the school to approve. Scanning alone does not give access."], 80, 540, { width: 440 });
  doc.fontSize(11).fillColor("#555").text("Built on faith. Strengthened at home. Learning together.", 50, 750, { align: "center" });
  doc.end();
  return done;
}

export { Forbidden as F, createClass as a, registerSchool as b, createJoinRequest as c, decideJoinRequest as d, can as e, posterPdf as f, listJoinRequests as l, pendingSchools as p, resolveJoin as r, verifySchool as v };
//# sourceMappingURL=schools-CPeH0e6J.js.map
