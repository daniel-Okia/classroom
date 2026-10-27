/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';
const sw = self as unknown as ServiceWorkerGlobalScope;
const SHELL = `shell-${version}`, PAGES = 'pages-v1';

sw.addEventListener('install', (e) => e.waitUntil(caches.open(SHELL).then((c) => c.addAll([...build, ...files])).then(() => sw.skipWaiting())));
sw.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== SHELL && k !== PAGES).map((k) => caches.delete(k)))).then(() => sw.clients.claim())));

// Lessons and the pages a learner has opened stay readable offline. Writes (POST) are never cached: the app queues them itself.
sw.addEventListener('fetch', (e) => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  if ([...build, ...files].includes(url.pathname)) { e.respondWith(caches.match(req).then((r) => r ?? fetch(req))); return; }
  if (req.mode === 'navigate' && /^\/(learn|progress|school|practice)?(\/|$)/.test(url.pathname)) {
    e.respondWith(fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(PAGES).then((c) => c.put(req, copy)); } return res; })
      .catch(async () => (await caches.match(req)) ?? new Response('<h1>You are offline</h1><p>This page has not been opened on this phone yet.</p>', { status: 503, headers: { 'content-type': 'text/html' } })));
  }
});
