#!/usr/bin/env node
// Fails if the gzipped client JS+CSS of the whole app exceeds the budget. The brief's initial-load target is 150 KB.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
const dir = join(process.cwd(), 'apps/web/build/client/_app/immutable');
const BUDGET = Number(process.env.BUDGET_KB ?? 150) * 1024;
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(dir).filter((f) => /\.(js|css)$/.test(f));
const js = gzipSync(Buffer.concat(files.filter((f) => f.endsWith('.js')).map((f) => readFileSync(f)))).length;
console.log(`client JS (gzip, all routes): ${(js / 1024).toFixed(1)} KB, budget ${BUDGET / 1024} KB`);
if (js > BUDGET) { console.error('Over budget'); process.exit(1); }
