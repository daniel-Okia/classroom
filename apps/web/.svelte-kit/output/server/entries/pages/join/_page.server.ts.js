import { f as fail, r as redirect } from "../../../chunks/index2.js";
import { r as resolveJoin, c as createJoinRequest } from "../../../chunks/schools.js";
import { a as actorFor } from "../../../chunks/auth.js";
const load = async ({ url, locals }) => {
  if (!locals.user) throw redirect(303, `/login`);
  const code = url.searchParams.get("c");
  const qr = url.searchParams.get("t");
  const target = code || qr ? await resolveJoin({ code: code ?? void 0, qr: qr ?? void 0 }) : null;
  return { target, code, notFound: !!(code || qr) && !target };
};
const actions = {
  lookup: async ({ request }) => {
    const code = String((await request.formData()).get("code") ?? "");
    const t = await resolveJoin({ code });
    if (!t) return fail(404, { error: "We could not find that code. Check it and try again." });
    throw redirect(303, `/join?c=${encodeURIComponent(code)}`);
  },
  request: async ({ request, locals }) => {
    const f = await request.formData();
    const child = String(f.get("child") ?? "").trim();
    if (!child) return fail(400, { error: "Please type your child's name." });
    const t = await resolveJoin({ code: String(f.get("code")) });
    if (!t) return fail(404, { error: "That code is no longer valid." });
    await createJoinRequest(await actorFor(locals.user.id), t, child);
    return { sent: true, school: t.schoolName };
  }
};
export {
  actions,
  load
};
