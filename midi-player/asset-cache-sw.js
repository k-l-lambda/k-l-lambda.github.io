// Based on klstudio/public/asset-cache-sw.js. Scope is only /midi-player/.
const VERSION = '0e86c9a03143eafcb5be';
const BASE = new URL('./', self.location.href);
const PREFIX = `klblog-midi-assets:${BASE.pathname}:`;
const CACHE = PREFIX + VERSION;
const ASSETS = new Set(['gm.sf3', 'libfluidsynth.js', 'js-synthesizer.worklet.js']);
const pending = new Map();
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  try {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)));
  } catch (_) { /* Storage can be unavailable; playback must still work. */ }
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== BASE.origin ||
      !url.pathname.startsWith(BASE.pathname) ||
      !ASSETS.has(url.pathname.slice(BASE.pathname.length)) || url.searchParams.get('v') !== VERSION) return;
  let shared = pending.get(url.href);
  if (!shared) {
    let resolve, reject;
    shared = new Promise((yes, no) => { resolve = yes; reject = no; });
    pending.set(url.href, shared);
    // Keep the response stream available to concurrent iframe requests until the
    // cache write completes. Each consumer receives its own clone, with real progress.
    const lifetime = (async () => {
      let cache;
      try {
        cache = await caches.open(CACHE);
        const hit = await cache.match(request);
        if (hit) {resolve(hit); return;}
      } catch (_) { cache = null; }
      try {
        const response = await fetch(request);
        resolve(response);
        if (cache && response.ok && response.status === 200) {
          try {await cache.put(request, response.clone());} catch (_) { /* Quota / private mode. */ }
        }
      } catch (error) { reject(error); }
    })().finally(() => pending.delete(url.href));
    event.waitUntil(lifetime);
  }
  event.respondWith(shared.then(response => response.clone()));
});
