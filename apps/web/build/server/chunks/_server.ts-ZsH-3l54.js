import { b as needRole } from './ctx-BAwda80F.js';
import { c as client } from './db-4b7EjHA-.js';
import { f as posterPdf } from './schools-CPeH0e6J.js';
import './index2-BPhdCyyv.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm';
import 'drizzle-orm/pg-core';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';

const GET = async ({ locals, url }) => {
  const a = needRole(locals, "school_admin");
  const [s] = await client`select name, join_code from school where id = ${a.schoolId}`;
  const pdf = await posterPdf(url.origin, s.name, s.join_code);
  return new Response(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": 'inline; filename="classroom-poster.pdf"' } });
};

export { GET };
//# sourceMappingURL=_server.ts-ZsH-3l54.js.map
