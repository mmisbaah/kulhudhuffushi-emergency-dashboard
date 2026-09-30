/* =====================================================
   SERVICE WORKER — offline support for the HDK
   Emergency Exercise Dashboard.

   Strategy:
   - Core shell precached on install.
   - Navigation (HTML): network-first, fall back to cached
     shell when offline → users always get fresh deploys
     when online.
   - Static assets (css/js/icons): cache-first — safe
     because every asset URL is version-busted with ?v=.
   ===================================================== */

var CACHE = 'hdk-emergency-v1';

var CORE = [
  './',
  'index.html',
  'css/styles.css',
  'js/data.js',
  'js/app.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      /* addAll fails the whole install if any 404s — add individually */
      return Promise.all(CORE.map(function (url) {
        return cache.add(new Request(url, { cache: 'reload' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; /* e.g. Open-Meteo API — always network */

  /* Navigations: network-first, offline fallback to cached shell */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('index.html', copy); }).catch(function () {});
        return res;
      }).catch(function () {
        return caches.match('index.html', { ignoreSearch: true }).then(function (r) {
          return r || caches.match('./');
        });
      })
    );
    return;
  }

  /* Static assets: cache-first (URLs are ?v= versioned) */
  event.respondWith(
    caches.match(req, { ignoreSearch: false }).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res && res.ok && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        }
        return res;
      });
    })
  );
});
