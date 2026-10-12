const V = 'v2'; // bump this on every release
const SHELL = `smaps-shell-${V}`;
const STATIC = `smaps-static-${V}`;
const FONTS = 'smaps-fonts-v1';
const TILES = 'smaps-tiles-v1';
const KEEP = [SHELL, STATIC, FONTS, TILES];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL).then((c) =>
      c.addAll(['/', '/offline.html', '/manifest.webmanifest', '/pwa-192x192.png', '/pwa-512x512.png'])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(name, max) {
  const c = await caches.open(name);
  const keys = await c.keys();
  if (keys.length > max) await c.delete(keys[0]);
}

const cacheFirst = async (req, name, max) => {
  const c = await caches.open(name);
  const hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  c.put(req, res.clone());
  if (max) trim(name, max);
  return res;
};

const networkFirst = async (req) => {
  const c = await caches.open(SHELL);
  try {
    const res = await fetch(req);
    c.put(req, res.clone());
    return res;
  } catch {
    return (await c.match(req)) || (await c.match('/')) || (await c.match('/offline.html'));
  }
};

const staleWhileRevalidate = async (req, name) => {
  const c = await caches.open(name);
  const hit = await c.match(req);
  const net = fetch(req).then((res) => { c.put(req, res.clone()); return res; }).catch(() => hit);
  return hit || net;
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.hostname === 'tile.openstreetmap.org' || url.hostname.endsWith('.tile.openstreetmap.org'))
    return e.respondWith(cacheFirst(req, TILES, 300));
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com')
    return e.respondWith(staleWhileRevalidate(req, FONTS));

  if (url.origin !== location.origin) return;

  if (url.pathname.startsWith('/_next/static/'))
    return e.respondWith(cacheFirst(req, STATIC));
  if (req.mode === 'navigate' || req.headers.get('RSC') || url.searchParams.has('_rsc'))
    return e.respondWith(networkFirst(req));
});
