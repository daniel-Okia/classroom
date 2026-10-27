// `pnpm --filter @classroom/web seed` loads taxonomy, lessons and the draft devotion plan into the dev DB.
import { join } from 'node:path';
process.env.CONTENT_DIR ??= join(process.cwd(), '..', '..', 'content');
const { loadContent, seedDevotions } = await import('./library');
const { client } = await import('./db');
console.log(await loadContent(false)); await seedDevotions(); await client.end();
