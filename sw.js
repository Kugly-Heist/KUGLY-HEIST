/* Kugly Heist service worker: caches every game file so the game works offline.
   Strategy: cache-first. Everything is precached on install into one versioned cache,
   and the old cache is deleted when the new worker activates.

   IMPORTANT: bump CACHE below on every release, otherwise players keep the old files. */
const CACHE = 'kugly-heist-20261110f';
const ASSETS = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/three.min.js', 'js/GLTFLoader.js', 'js/data-icons.js', 'js/game.js', 'js/intro.js',
  'icon-192.png', 'icon-512.png',
  'models/agent.glb', 'models/body.bin',
  'music/lobby.mp3', 'music/main.mp3',
  'video/intro.mp4'
];

self.addEventListener('install', e => {
  /* cache:'reload' skips the browser HTTP cache so we never store stale copies */
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* <video> asks for byte ranges; a cached 200 response must be answered with a 206 slice */
async function rangeResponse(req, res) {
  const buf = await res.arrayBuffer(), size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  let start = 0, end = size - 1;
  if (m) {
    if (m[1]) { start = +m[1]; if (m[2]) end = +m[2]; }
    else if (m[2]) { start = Math.max(0, size - +m[2]); }
  }
  end = Math.min(end, size - 1);
  if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'video/mp4',
      'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
      'Content-Length': String(end - start + 1)
    }
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return; /* CDN and sound fallbacks go straight to the network */
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    /* ignoreSearch: the ?v=... cache-busting query in index.html does not matter, the CACHE name versions everything */
    let res = await cache.match(req, { ignoreSearch: true });
    if (!res) {
      try {
        res = await fetch(req);
        if (res.status === 200) cache.put(req, res.clone()); /* e.g. sounds/*.mp3 once they are added to the repo */
      } catch (err) {
        if (req.mode === 'navigate') res = await cache.match('index.html');
        if (!res) throw err;
      }
    }
    if (req.headers.has('range') && res.status === 200) return rangeResponse(req, res);
    return res;
  })());
});
