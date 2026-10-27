import { e as error, j as json } from './index2-BPhdCyyv.js';
import { eq } from 'drizzle-orm';
import { i as inSchool, b as packageEnrolments } from './db-4b7EjHA-.js';
import { s as submitQuiz } from './library-D9CgKNox.js';
import { s as startSession, r as reportActive } from './study-CLb9I594.js';
import { F as Forbidden } from './schools-CPeH0e6J.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import 'node:path';
import './schedule-C4Gr4JUv.js';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';

async function applySync(actor, item) {
  if (!actor.roles.includes("student") || !actor.schoolId) throw new Forbidden("Open the app as the student to sync");
  if (item.type === "quiz") return { type: "quiz", ...await submitQuiz(actor, item.quizId, item.answers, item.clientKey) };
  if (item.type === "checkin") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) throw new RangeError("Bad date");
    const e = await inSchool(actor.schoolId, async (tx) => (await tx.select().from(packageEnrolments).where(eq(packageEnrolments.studentId, actor.id)))[0]);
    if (!e) return { type: "checkin", skipped: true };
    await startSession(actor, e.id, item.date, item.clientKey);
    const s = await reportActive(actor, item.clientKey, item.activeSeconds, true);
    return { type: "checkin", minutes: Math.round(s.activeSeconds / 60) };
  }
  throw new RangeError("Unknown item");
}
const POST = async ({ request, locals }) => {
  if (!locals.actor?.schoolId) throw error(401, "Sign in first");
  const item = await request.json().catch(() => null);
  if (!item || typeof item.clientKey !== "string" || item.clientKey.length > 80) throw error(400, "Bad request");
  try {
    return json(await applySync(locals.actor, item));
  } catch (e) {
    throw error(e instanceof RangeError ? 400 : 403, e.message);
  }
};

export { POST };
//# sourceMappingURL=_server.ts-x5JUaiat.js.map
