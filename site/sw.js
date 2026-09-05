const CACHE_PREFIX = 'rbs-git-agent-';
const CACHE_NAME = `${CACHE_PREFIX}v8-raster-safe-shell`;
const STATIC_ASSETS = new Set([
  './agent.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
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
  if(request.headers.has('authorization') || request.headers.has('cookie') || request.headers.has('range') || request.headers.has('if-range')) return true;
  if(PRIVATE_PATH_RE.test(url.pathname) || hasSensitiveQuery(url)) return true;
  return false;
}

function shellKey(url){
  if(url.search) return null;
  const name = url.pathname.split('/').pop();
  if(name === 'agent.html') return './agent.html';
  if(name === 'manifest.webmanifest') return './manifest.webmanifest';
  if(name === 'icon-192.png') return './icon-192.png';
  if(name === 'icon-512.png') return './icon-512.png';
  if(name === 'icon-512-maskable.png') return './icon-512-maskable.png';
  return null;
}

function responseIsSafeToCache(response){
  if(!response || !response.ok || response.type !== 'basic' || response.status === 206 || response.redirected) return false;
  const cacheControl = (response.headers.get('cache-control') || '').toLowerCase();
  if(cacheControl.includes('no-store') || cacheControl.includes('private')) return false;
  if(response.headers.has('set-cookie') || response.headers.has('content-range')) return false;
  return true;
}

async function safeFetchAndCache(cache, key){
  const request = new Request(key, {
    method: 'GET',
    credentials: 'omit',
    cache: 'no-store',
    redirect: 'error'
  });
  const response = await fetch(request);
  if(responseIsSafeToCache(response)) await cache.put(key, response.clone());
  return response;
}

self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache = await caches.open(CACHE_NAME);
    await Promise.all([...STATIC_ASSETS].map(async key => {
      try { await safeFetchAndCache(cache, key); } catch (_) { /* offline install: skip asset */ }
    }));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if(url.origin !== self.location.origin || isSensitive(request, url)) return;

  if(request.mode === 'navigate'){
    const networkRequest = new Request(request, { cache: 'no-store' });
    event.respondWith((async()=>{
      try {
        const response = await fetch(networkRequest);
        return response;
      } catch (_) {
        return (await caches.match('./agent.html')) || Response.error();
      }
    })());
    return;
  }

  const key = shellKey(url);
  if(!key || !STATIC_ASSETS.has(key)) return;

  event.respondWith(caches.match(key).then(async hit => {
    if(hit) return hit;
    const cache = await caches.open(CACHE_NAME);
    try { return await safeFetchAndCache(cache, key); }
    catch (_) { return Response.error(); }
  }));
});
