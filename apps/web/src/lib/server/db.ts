import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import * as schema from '@classroom/db';

const url = process.env.DATABASE_URL ?? 'postgres://app_user@127.0.0.1:54329/classroom';
export const client = postgres(url, { max: 10, onnotice: () => {} });
export const db = drizzle(client, { schema });
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Run `fn` inside a transaction scoped to one school. Postgres RLS enforces isolation from here on. */
export function inSchool<T>(schoolId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.school_id', ${schoolId}, true)`);
    return fn(tx);
  });
}
export { schema, sql };
