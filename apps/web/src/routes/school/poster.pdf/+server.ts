import type { RequestHandler } from './$types';
import { needRole } from '$lib/server/ctx';
import { client } from '$lib/server/db';
import { posterPdf } from '$lib/server/schools';
export const GET: RequestHandler = async ({ locals, url }) => {
  const a = needRole(locals, 'school_admin');
  const [s] = await client`select name, join_code from school where id = ${a.schoolId!}`;
  const pdf = await posterPdf(url.origin, s!.name, s!.join_code);
  return new Response(pdf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="classroom-poster.pdf"' } });
};
