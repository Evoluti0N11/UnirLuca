/* ===== sw.js — Service Worker for Sara Korean App ===== */
const CACHE_NAME = 'sara-korean-v5';

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './js/modules/state.js',
  './js/modules/renderer.js',
  './js/modules/actions.js',
  './js/modules/audio.js',
  './js/modules/timer.js',
  './js/modules/map.js',
  './js/modules/utils.js',
  './js/views/home.js',
  './js/views/dashboard.js',
  './js/views/lesson.js',
  './js/views/explore.js',
  './js/views/library.js',
  './js/views/profile.js',
  './js/views/layout.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS.filter(a => !a.startsWith('http')))));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.hostname.includes('translate.googleapis') || url.hostname.includes('youtube')) return;
  if (url.hostname.includes('carto') || url.hostname.includes('openstreetmap')) {
    e.respondWith(fetch(e.request).then(res => { caches.open(CACHE_NAME+'-tiles').then(c => c.put(e.request, res.clone())); return res; }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => {
    if (cached) return cached;
    return fetch(e.request).then(res => {
      if (!res || res.status !== 200 || res.type === 'opaque') return res;
      caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
      return res;
    });
  }).catch(() => { if (e.request.destination === 'document') return caches.match('./index.html'); }));
});
