/* GROCEREIS service worker — app-shell caching */
const CACHE = 'grocereis-v7';
const SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icon.svg',
  './icon-maskable.svg',
  './jingle.mp3'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  // Bypass Supabase / fonts / external — go to network
  if(url.origin !== self.location.origin){
    return;
  }

  // App shell: cache-first
  e.respondWith(
    caches.match(req).then(cached => {
      if(cached){
        // refresh in background
        fetch(req).then(r => { if(r.ok) caches.open(CACHE).then(c => c.put(req, r.clone())); }).catch(()=>{});
        return cached;
      }
      return fetch(req).then(r => {
        if(r.ok) caches.open(CACHE).then(c => c.put(req, r.clone()));
        return r;
      }).catch(() => cached);
    })
  );
});
