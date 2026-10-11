/**
 * Service worker: permite usar la plataforma sin conexión después de la
 * primera visita. Estrategia "red primero": con internet siempre se carga la
 * versión más nueva; sin internet se usa la copia guardada.
 *
 * Al publicar cambios, incrementa CACHE_VERSION. Si agregas archivos, súmalos
 * a ASSETS (una prueba automatizada verifica que la lista esté completa).
 */
const CACHE_VERSION = 'v1';
const CACHE_NAME = `un-mundo-para-todos-${CACHE_VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './js/app.js',
  './js/art/animals.js',
  './js/art/icons.js',
  './js/art/mascot.js',
  './js/art/objects.js',
  './js/art/scenes.js',
  './js/art/shapes.js',
  './js/art/svg.js',
  './js/components/celebrate.js',
  './js/components/choiceGame.js',
  './js/components/lsecPlayer.js',
  './js/components/memoryGame.js',
  './js/components/prefsForm.js',
  './js/components/ui.js',
  './js/core/dom.js',
  './js/core/random.js',
  './js/core/router.js',
  './js/core/sfx.js',
  './js/core/speech.js',
  './js/core/store.js',
  './js/data/animals.js',
  './js/data/colors.js',
  './js/data/lsec.js',
  './js/data/worlds.js',
  './js/games/animals.js',
  './js/games/colors.js',
  './js/games/helpers.js',
  './js/games/numbers.js',
  './js/games/registry.js',
  './js/screens/home.js',
  './js/screens/notFound.js',
  './js/screens/play.js',
  './js/screens/prefs.js',
  './js/screens/teachers.js',
  './js/screens/world.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('un-mundo-para-todos-') && k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  // Los videos LSEC no se guardan automáticamente (pueden pesar mucho).
  if (request.destination === 'video') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: true }).then((cached) => {
          if (cached) return cached;
          if (request.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        })
      )
  );
});
