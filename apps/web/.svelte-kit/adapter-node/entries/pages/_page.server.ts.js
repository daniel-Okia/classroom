import { f as fail, r as redirect } from "../../chunks/index2.js";
import { f as faithFor, e as enrolmentFor, w as weekFor, c as childrenOf, o as openPackages, p as pendingJoins, a as classOverview } from "../../chunks/views.js";
import { v as verseOfTheDay } from "../../chunks/library.js";
import { m as myRequests, n as noticesForGuardian } from "../../chunks/hub.js";
import { e as enrolChild } from "../../chunks/study.js";
const load = async ({ locals }) => {
  if (!locals.user) throw redirect(303, "/login");
  const a = locals.actor;
  if (!a?.schoolId) return { mode: a?.roles.includes("platform_admin") ? "platform" : "none" };
  const faith = await faithFor(a.schoolId);
  const doy = Math.floor((Date.now() - Date.UTC((/* @__PURE__ */ new Date()).getUTCFullYear(), 0, 0)) / 864e5);
  const verse = await verseOfTheDay(faith, doy);
  if (a.roles.includes("student")) {
    return { mode: "student", name: locals.user.name, verse, week: await weekFor(a, a.id), enrolment: await enrolmentFor(a, a.id) };
  }
  if (a.roles.includes("guardian")) {
    const kids = await childrenOf(a);
    const children = await Promise.all(kids.map(async (k) => ({ ...k, week: await weekFor(a, k.id), enrolment: await enrolmentFor(a, k.id) })));
    return { mode: "guardian", verse, children, notices: (await noticesForGuardian(a).catch(() => [])).slice(0, 4), requests: (await myRequests(a)).slice(0, 3), packages: await openPackages(a) };
  }
  const isAdmin = a.roles.includes("school_admin");
  return { mode: "staff", classes: await classOverview(a), pending: isAdmin ? (await pendingJoins(a)).length : 0, isAdmin };
};
const actions = {
  studyAs: async ({ request, cookies }) => {
    const id = String((await request.formData()).get("child"));
    cookies.set("as", id, { path: "/", httpOnly: true, sameSite: "lax" });
    throw redirect(303, "/");
  },
  exitChild: async ({ cookies }) => {
    cookies.delete("as", { path: "/" });
    throw redirect(303, "/");
  },
  enrol: async ({ request, locals }) => {
    const f = await request.formData();
    try {
      await enrolChild(locals.actor, String(f.get("pkg")), String(f.get("child")));
    } catch (e) {
      return fail(400, { error: e.message });
    }
    return { enrolled: true };
  }
};
export {
  actions,
  load
};
