/** Where to send someone after sign-in. Only same-site paths are accepted (no open redirect). */
export const safeNext = (v: unknown): string | null => (typeof v === 'string' && /^\/(?![/\\])[\w\-./?=&%]*$/.test(v) && !v.startsWith('/login') ? v : null);
export const loginUrl = (url: URL) => { const n = safeNext(url.pathname + url.search); return n && n !== '/' ? `/login?next=${encodeURIComponent(n)}` : '/login'; };
