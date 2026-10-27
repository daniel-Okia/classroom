import { e as error } from './index2-BPhdCyyv.js';
import { a as needActor } from './ctx-BAwda80F.js';
import { l as listEvents, i as icsFor } from './hub-CZDImyf3.js';
import 'drizzle-orm';
import './schools-CPeH0e6J.js';
import 'node:crypto';
import 'qrcode';
import 'pdfkit';
import './db-4b7EjHA-.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const GET = async ({ locals, params }) => {
  const e = (await listEvents(needActor(locals))).find((x) => x.id === params.id.replace(/\.ics$/, ""));
  if (!e) throw error(404, "Event not found");
  return new Response(icsFor(e), { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="event.ics"' } });
};

export { GET };
//# sourceMappingURL=_server.ts-BA3Cma37.js.map
