// Service worker for The Design Grit
const CACHE_NAME = 'tdg-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/Assets/TDG_Logo_Black.webp',
  '/Assets/Video-hero/poster.avif',
  '/fonts/Horizon-Bold.woff2',
  '/fonts/Montserrat-Regular.woff2',
  '/Styles/style.css'
];

// Install event - cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) || 
      event.request.url.includes('api.thedesigngrit.com')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response for caching and return
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            // Only cache successful responses
            if (response.status === 200) {
              cache.put(event.request, responseToCache);
            }
          });
          
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request);
      })
  );
});