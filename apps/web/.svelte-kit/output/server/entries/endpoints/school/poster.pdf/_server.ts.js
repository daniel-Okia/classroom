import { b as needRole } from "../../../../chunks/ctx.js";
import { c as client } from "../../../../chunks/db.js";
import { b as posterPdf } from "../../../../chunks/schools.js";
const GET = async ({ locals, url }) => {
  const a = needRole(locals, "school_admin");
  const [s] = await client`select name, join_code from school where id = ${a.schoolId}`;
  const pdf = await posterPdf(url.origin, s.name, s.join_code);
  return new Response(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": 'inline; filename="classroom-poster.pdf"' } });
};
export {
  GET
};
