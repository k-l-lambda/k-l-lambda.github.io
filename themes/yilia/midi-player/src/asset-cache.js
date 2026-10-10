// Persistent cache shared by all same-origin embeds, with a non-blocking fallback.
export const version = __MIDI_ASSET_VERSION__;
const base = new URL('./', location.href);
export const cacheName = `klblog-midi-assets:${base.pathname}:${version}`;
export const assetURL = name => new URL(`${name}?v=${version}`, base).href;
let registration;
export function ensureAssetCache() {
  if (registration) return registration;
  registration = new Promise(resolve => {
    const sw = navigator.serviceWorker;
    if (!sw || !window.isSecureContext) {resolve(); return;}
    let timer;
    const done = () => {clearTimeout(timer); sw.removeEventListener('controllerchange', changed); resolve();};
    const ownsController = () => sw.controller && new URL(sw.controller.scriptURL).pathname === new URL('asset-cache-sw.js', base).pathname;
    const changed = () => {if (ownsController()) done();};
    timer = setTimeout(done, 2500);
    sw.addEventListener('controllerchange', changed);
    sw.register(new URL('asset-cache-sw.js', base), {scope: base.href, updateViaCache: 'none'})
      .then(changed).catch(done);
  });
  return registration;
}
async function read(response, onProgress, cached) {
  if (!response.ok) throw new Error(`Piano download failed (HTTP ${response.status}). Please try again.`);
  // Fetch exposes decoded bytes; compressed HTTP Content-Length is not comparable.
  const encoding = response.headers.get('content-encoding');
  const total = encoding && encoding !== 'identity' ? 0 : Number(response.headers.get('content-length')) || 0;
  if (!response.body?.getReader) return response.arrayBuffer();
  const reader = response.body.getReader(), chunks = [];
  let loaded = 0, last = 0;
  onProgress({loaded, total, cached});
  try {
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      chunks.push(value); loaded += value.byteLength;
      if (performance.now() - last > 80) {onProgress({loaded, total, cached}); last = performance.now();}
    }
  } finally {reader.releaseLock();}
  const result = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {result.set(chunk, offset); offset += chunk.byteLength;}
  onProgress({loaded, total: loaded, cached});
  return result.buffer;
}
export async function loadSoundfont(onProgress) {
  const url = assetURL('gm.sf3');
  const load = async () => {
    let cache, hit;
    try {cache = await caches.open(cacheName); hit = await cache.match(url);} catch (_) { /* Best effort. */ }
    if (hit) return read(hit, onProgress, true);
    const response = await fetch(url);
    const backup = cache && response.ok && response.status === 200 ? response.clone() : null;
    const bytes = await read(response, onProgress, false);
    // Also populate the cache when SW registration/control is unavailable. Await
    // the write before releasing the cross-frame lock so the next player can reuse it.
    if (backup) {
      try {if (!await cache.match(url)) await cache.put(url, backup);} catch (_) { /* Playback still succeeds. */ }
    }
    return bytes;
  };
  if (navigator.locks?.request) {
    onProgress({waiting: true});
    return navigator.locks.request(cacheName + ':soundfont', load);
  }
  return load();
}
