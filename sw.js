/* AR ENTERPRISE — Service Worker v15 (cross-browser)
   Caches core assets and serves an offline fallback for navigation requests.
*/

const CACHE_NAME = 'are-static-v15';
const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './style.css?v=15.0',
  './main.js?v=15.0',
  './products.js?v=15.0',
  './logo.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  // Network-first for navigation (so users get fresh content), fallback to offline page
  if (isNavigation) {
    event.respondWith(
      fetch(event.request).then(response => {
        // Update cache in background
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match('./offline.html'))
    );
    return;
  }

  // Don't cache large media (mp4) — serve from network when possible
  if (event.request.destination === 'video' || requestUrl.pathname.endsWith('.mp4')) {
    event.respondWith(fetch(event.request).catch(() => caches.match('./offline.html')));
    return;
  }

  // Cache-first for other assets
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (!response || response.status !== 200 || response.type === 'opaque') return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./offline.html')))
  );
});

// Allow the page to send a message to skip waiting and immediately activate a new SW
self.addEventListener('message', (evt) => {
  if (evt.data && evt.data.type === 'SKIP_WAITING') self.skipWaiting();
});
