const CACHE_NAME = 'caminadora-cache-v1';
const urlsToCache = [
  "./RunnerApp.html",
  "./manifest.json",
  "./step-sound.mp3",
  "./beep.mp3",
  "./icon-192x192.png",
  "./icon-512x512.png"
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching files');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
  console.log('Fetch event for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('Serving from cache:', event.request.url);
        return response;
      }
      console.log('Fetching from network:', event.request.url);
      return fetch(event.request);
    })
  );
});