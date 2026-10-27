// Tiny offline outbox in localStorage. Items replay in order to /api/sync; the server de-duplicates by clientKey.
const KEY = 'classroom.outbox.v1';
export interface Item { type: string; clientKey: string; [k: string]: unknown }
const read = (): Item[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; } };
const write = (a: Item[]) => { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* storage full or blocked */ } };
export const pending = () => read().length;
export const key = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());

/** Send now; on network failure queue it. Returns the server result, or null when queued. */
export async function send(item: Item): Promise<any | null> {
  try {
    const r = await fetch('/api/sync', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(item) });
    if (r.ok) return r.json();
    if (r.status >= 400 && r.status < 500) throw new Error((await r.json().catch(() => ({ message: 'Rejected' }))).message);
  } catch (e: any) { if (e instanceof TypeError) { const q = read(); if (!q.some((x) => x.clientKey === item.clientKey)) write([...q, item]); return null; } throw e; }
  const q = read(); write([...q, item]); return null;
}
export async function flush(): Promise<number> {
  let sent = 0;
  for (const item of read()) {
    try {
      const r = await fetch('/api/sync', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(item) });
      if (r.ok || (r.status >= 400 && r.status < 500)) { write(read().filter((x) => x.clientKey !== item.clientKey)); sent++; } else break;
    } catch { break; }
  }
  return sent;
}
