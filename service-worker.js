const CACHE_NAME = 'shelve-scanner-v1.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css?v=1.1',
  '/app.js?v=1.1',
  '/images/icon16.png',
  '/images/icon48.png',
  '/images/icon128.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 