const ver = `0.8.2`;
const cacheName = `muteswan-${ver}`;

const precache = [
  `/`,
  `/assets/muteswan.min.js?v=${ver}`,
  `/assets/fonts/noto-sans-v9-latin-400.woff2`,
  `/assets/fonts/comfortaa-v28-latin-700.woff2`
];

self.addEventListener('install', ev => {
  console.log(`install`);
  self.skipWaiting();
  ev.waitUntil(caches.open(cacheName).then(cache => cache.addAll(precache)));
});

self.addEventListener('activate', ev => {
  console.log(`activate`);
  ev.waitUntil(self.clients.claim());
  ev.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

const fromCache = request =>
  caches.open(cacheName).then(cache => cache.match(request));

const updateCache = (request, response) =>
  caches.open(cacheName).then(cache => cache.put(request, response));

const fetchAndCache = ev =>
  fetch(ev.request)
    .then(response => {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      ev.waitUntil(updateCache(ev.request, response.clone()));
      return response;
    })
    .catch(err => {
      console.log(err);
    });

self.addEventListener('fetch', ev => {
  if (ev.request.method !== 'GET') {
    return;
  }
  const url = new URL(ev.request.url);
  ev.respondWith(
    fromCache(ev.request).then(response => {
      if (response) {
        console.log(`from cache: ${url.pathname}`);
        ev.waitUntil(fetchAndCache(ev));
        return response;
      }
      console.log(`from fetch: ${url.pathname}`);
      return fetchAndCache(ev);
    })
  );
});
