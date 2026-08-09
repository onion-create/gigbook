/**
 * 跑单记 (Gigbook) — Service Worker v3.4.0
 *
 * Cache strategy:
 *  - Pre-cache critical static assets (CSS, icons, UMD libs, manifest)
 *  - HTML & JS modules: network-first, cache fallback for offline
 *  - Version bump automatically clears old caches on activate
 */

const APP_VERSION = '3.4.0';
const CACHE_STATIC = 'gigbook-static-v' + APP_VERSION;
const CACHE_RUNTIME = 'gigbook-runtime-v' + APP_VERSION;

// Pre-cache on install: only essential static assets that rarely change
const STATIC_ASSETS = [
  './',
  './src/styles.css',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  './chart.umd.min.js',
  './qrcode.min.js',
  './config.example.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache failed:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_STATIC && key !== CACHE_RUNTIME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip API proxy paths
  if (url.pathname.includes('/api/')) return;

  // Strategy: HTML and JS modules → network-first with cache fallback
  // This ensures updates are picked up immediately
  const isHTMLorJS = url.pathname.endsWith('.html') ||
                     url.pathname.endsWith('.js') ||
                     url.pathname === '/' ||
                     !url.pathname.includes('.');

  if (isHTMLorJS) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache a copy of the response for offline use
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_RUNTIME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          // Offline: return cached version if available
          return caches.match(request);
        })
    );
    return;
  }

  // For static assets (CSS, images, fonts), use cache-first
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});
