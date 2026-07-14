self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      self.clients.claim();
    }).then(() => {
      self.registration.unregister();
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Do nothing, just pass through to network
  e.respondWith(fetch(e.request).catch(() => new Response('Failed')));
});
