#!/usr/bin/env node
// Verdict-gated, robots-aware fetcher. Usage:
//   node tools/ingest/ingest.mjs <source> index            list PDFs found on the index pages
//   node tools/ingest/ingest.mjs <source> download [--match text] [--limit n]
// Refuses any source whose verdict in sources.json is not INGEST.
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const CACHE = join(here, '.cache');
const RAW = join(root, 'data', 'raw');
const PROV = join(root, 'data', 'provenance.jsonl');
const UA = 'ClassroomIngest/0.1 (+contact: danielokia256@gmail.com; educational non-commercial test)';
const DELAY_MS = 2000;

const [source, cmd = 'index', ...rest] = process.argv.slice(2);
const flag = (n) => { const i = rest.indexOf(`--${n}`); return i >= 0 ? rest[i + 1] : undefined; };
const sources = JSON.parse(readFileSync(join(here, 'sources.json'), 'utf8'));
const cfg = sources[source];
if (!cfg) { console.error(`Unknown source "${source}"`); process.exit(2); }
if (cfg.verdict !== 'INGEST') { console.error(`Refusing: ${source} verdict is ${cfg.verdict}, not INGEST.`); process.exit(3); }

mkdirSync(CACHE, { recursive: true }); mkdirSync(RAW, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let last = 0;
const sha = (b) => createHash('sha256').update(b).digest('hex');

async function polite(url) {
  const key = join(CACHE, sha(Buffer.from(url)));
  if (existsSync(key)) return readFileSync(key);
  const wait = last + DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  last = Date.now();
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(key, buf);
  return buf;
}

// Minimal robots.txt check: group "*" Disallow prefixes. Empty or missing file = allowed.
async function allowed(path) {
  let txt = '';
  try { txt = (await polite(cfg.baseUrl + '/robots.txt')).toString(); } catch { return true; }
  let inStar = false; const dis = [];
  for (const raw of txt.split('\n')) {
    const l = raw.split('#')[0].trim(); const m = l.match(/^([\w-]+):\s*(.*)$/); if (!m) continue;
    const [k, v] = [m[1].toLowerCase(), m[2]];
    if (k === 'user-agent') inStar = v === '*';
    else if (k === 'disallow' && inStar && v) dis.push(v);
  }
  return !dis.some((d) => path.startsWith(d));
}

async function listPdfs() {
  const found = new Map();
  for (let p = 1; p <= cfg.maxPages; p++) {
    const path = `${cfg.indexPath}?${cfg.pageParam}=${p}`;
    if (!(await allowed(path))) { console.error('robots disallows', path); break; }
    let html;
    try { html = (await polite(cfg.baseUrl + path)).toString(); } catch (e) { console.error(e.message); break; }
    const links = [...html.matchAll(/https?:\/\/[^"'\s]+\.pdf/gi)].map((m) => m[0]);
    if (!links.length && p > 1) break;
    for (const u of links) found.set(u, decodeURIComponent(u.split('/').pop()));
  }
  return [...found].map(([url, name]) => ({ url, name }));
}

const items = await listPdfs();
const match = flag('match')?.toLowerCase();
const sel = items.filter((i) => !match || i.name.toLowerCase().includes(match)).slice(0, Number(flag('limit') ?? 1e9));
if (cmd === 'index') { for (const i of sel) console.log(i.name, '\n  ', i.url); console.log(`${sel.length} PDFs`); process.exit(0); }

mkdirSync(join(RAW, source), { recursive: true });
for (const i of sel) {
  if (!(await allowed(new URL(i.url).pathname))) { console.error('robots disallows', i.url); continue; }
  const buf = await polite(i.url);
  const file = join(RAW, source, i.name);
  writeFileSync(file, buf);
  appendFileSync(PROV, JSON.stringify({
    sourceUrl: i.url, retrievedAt: new Date().toISOString(), licence: cfg.licence,
    sha256: sha(buf), bytes: buf.length, verdict: cfg.verdict, publishable: cfg.publishable, localPath: file.replace(root + '/', ''),
  }) + '\n');
  console.log('saved', i.name, buf.length);
}
