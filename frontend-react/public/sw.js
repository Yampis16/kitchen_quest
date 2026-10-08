const CACHE_NAME = 'kitchen-quest-v1';

const STATIC_ASSETS = [
  '/',
  '/recetas',
  '/menu-semanal',
  '/mercado',
  '/ingredientes',
  '/manifest.json',
];

// Instalación — cachea assets estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activación — limpia caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — Network first para API, Cache first para assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignora todo lo que no sea el mismo origen (frontend)
  // Esto incluye llamadas a localhost:8000 (backend)
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Assets del frontend — red primero, caché como fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});