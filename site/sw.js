const CACHE_NAME = 'rbs-git-agent-v4-safe-shell';
const STATIC_ASSETS = new Set([
  './agent.html',
  './manifest.webmanifest',
  './icon-192.svg',
  './icon-512.svg',
  './icon-512-maskable.svg'
]);
const PRIVATE_PATH_RE = /\/(api|auth|login|logout|admin|session|sessions|token|tokens|account|profile|me)(\/|$)/i;
const SENSITIVE_QUERY_KEYS = new Set([
  'token','access_token','refresh_token','password','passwd','pwd','secret',
  'session','session_id','auth','authorization','api_key','apikey','key','code',
  'credential','credentials'
]);

function hasSensitiveQuery(url){
  for(const key of url.searchParams.keys()){
    if(SENSITIVE_QUERY_KEYS.has(String(key).toLowerCase())) return true;
  }
  return false;
}

function isSensitive(request, url){
  if(request.method !== 'GET') return true;
  if(request.headers.has('authorization') || request.headers.has('cookie')) return true;
  if(PRIVATE_PATH_RE.test(url.pathname) || hasSensitiveQuery(url)) return true;
  return false;
}

function shellKey(url){
  if(url.search) return null;
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
    const networkRequest = new Request(request, { cache: 'no-store' });
    event.respondWith(fetch(networkRequest).catch(() => caches.match('./agent.html')));
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
