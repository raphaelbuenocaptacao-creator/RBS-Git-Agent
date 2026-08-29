const CACHE_NAME = 'rbs-git-agent-v2';
const STATIC_ASSETS = new Set([
  './agent.html',
  './manifest.webmanifest',
  './icon-192.svg',
  './icon-512.svg',
  './icon-512-maskable.svg'
]);
const PRIVATE_PATH_RE = /\/(api|auth|login|logout|admin|session|sessions|token|tokens|account|profile|me)(\/|$)/i;

function isSensitive(request, url){
  if(request.method !== 'GET') return true;
  if(request.headers.has('authorization') || request.headers.has('cookie')) return true;
  return PRIVATE_PATH_RE.test(url.pathname);
}

function shellKey(url){
  const name = url.pathname.split('/').pop();
  if(name === 'agent.html') return './agent.html';
  if(name === 'manifest.webmanifest') return './manifest.webmanifest';
  if(name === 'icon-192.svg') return './icon-192.svg';
  if(name === 'icon-512.svg') return './icon-512.svg';
  if(name === 'icon-512-maskable.svg') return './icon-512-maskable.svg';
  return null;
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([...STATIC_ASSETS])));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if(url.origin !== self.location.origin || isSensitive(request, url)) return;

  if(request.mode === 'navigate'){
    event.respondWith(fetch(request).catch(() => caches.match('./agent.html')));
    return;
  }

  const key = shellKey(url);
  if(!key || !STATIC_ASSETS.has(key)) return;

  event.respondWith(caches.match(key).then(hit => hit || fetch(request).then(response => {
    if(!response || !response.ok || response.type !== 'basic') return response;
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(key, copy));
    return response;
  })));
});
