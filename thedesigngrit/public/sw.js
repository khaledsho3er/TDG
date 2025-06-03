// Safari-compatible service worker
// Place this file in your public/ directory as sw.js

const CACHE_NAME = "thedesigngrit-v1";
const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";

// Resources to cache immediately
const STATIC_ASSETS = [
  "/",
  "/static/css/main.css",
  "/static/js/main.js",
  "/manifest.json",
  "/logo.ico",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.warn("Failed to cache static assets:", error);
      })
  );

  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - Safari-compatible caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests that might cause CORS issues
  if (url.origin !== location.origin) {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.status === 200 && response.type === "basic") {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache for navigation requests
          return caches.match("/").then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Ultimate fallback
            return new Response(
              `<!DOCTYPE html>
                <html>
                <head>
                  <title>The Design Grit - Offline</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { 
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      display: flex; 
                      justify-content: center; 
                      align-items: center; 
                      height: 100vh; 
                      margin: 0;
                      background: #f5f5f5;
                      text-align: center;
                    }
                    .offline-container {
                      padding: 2rem;
                      background: white;
                      border-radius: 8px;
                      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                      max-width: 400px;
                    }
                    .retry-btn {
                      background: #007bff;
                      color: white;
                      border: none;
                      padding: 12px 24px;
                      border-radius: 4px;
                      cursor: pointer;
                      font-size: 16px;
                      margin-top: 1rem;
                    }
                  </style>
                </head>
                <body>
                  <div class="offline-container">
                    <h1>You're Offline</h1>
                    <p>Please check your internet connection and try again.</p>
                    <button class="retry-btn" onclick="window.location.reload()">
                      Retry
                    </button>
                  </div>
                </body>
                </html>`,
              {
                headers: { "Content-Type": "text/html" },
              }
            );
          });
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (response.status === 200 && response.type === "basic") {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch((error) => {
            console.warn("Failed to fetch resource:", request.url, error);
            // Return a minimal fallback for failed resources
            if (request.destination === "image") {
              return new Response("", { status: 404 });
            }
            throw error;
          });
      })
    );
  }
});

// Handle Safari-specific issues
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_BUST") {
    // Clear cache for Safari refresh issues
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.includes("dynamic")) {
            return caches.delete(cacheName);
          }
        })
      );
    });
  }
});

// Clean up old chunks periodically (Safari memory management)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "cache-cleanup") {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.keys().then((requests) => {
          // Remove old cached chunks (keep only last 50)
          if (requests.length > 50) {
            const oldRequests = requests.slice(0, requests.length - 50);
            return Promise.all(
              oldRequests.map((request) => cache.delete(request))
            );
          }
        });
      })
    );
  }
});

console.log("Safari-compatible Service Worker loaded");
