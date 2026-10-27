import { r as redirect, e as error } from "./index2.js";
function needUser(locals) {
  if (!locals.user) throw redirect(303, "/login");
  return locals.user;
}
function needActor(locals) {
  needUser(locals);
  if (!locals.actor?.schoolId) throw redirect(303, "/");
  return locals.actor;
}
function needRole(locals, ...roles) {
  const a = needActor(locals);
  if (!a.roles.some((r) => roles.includes(r))) throw error(403, "Not allowed");
  return a;
}
const mondayOf = (d = /* @__PURE__ */ new Date()) => {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const i = (x.getUTCDay() + 6) % 7;
  x.setUTCDate(x.getUTCDate() - i);
  return { start: x.toISOString().slice(0, 10), end: new Date(x.getTime() + 6 * 864e5).toISOString().slice(0, 10), dayIndex: i };
};
export {
  needActor as a,
  needRole as b,
  mondayOf as m,
  needUser as n
};
