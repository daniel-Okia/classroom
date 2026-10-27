const load = async ({ locals, url }) => ({ user: locals.user, roles: locals.actor?.roles ?? [], hasSchool: !!locals.actor?.schoolId, path: url.pathname });
export {
  load
};
