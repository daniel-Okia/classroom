import { r as redirect } from './index2-BPhdCyyv.js';
import { e as endSession } from './auth-BXeAQLLF.js';
import 'node:crypto';
import 'drizzle-orm';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import './phone-CzGjwkCd.js';

const POST = async ({ cookies }) => {
  const sid = cookies.get("sid");
  if (sid) await endSession(sid);
  for (const c of ["sid", "school", "as"]) cookies.delete(c, { path: "/" });
  throw redirect(303, "/login");
};

export { POST };
//# sourceMappingURL=_server.ts-jpXeoJg3.js.map
