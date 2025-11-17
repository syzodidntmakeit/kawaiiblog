const CACHE_NAME = 'kawaiiblog-cache-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/pages/archive.html',
    '/pages/contact.html',
    '/pages/uses.html',
    '/pages/search.html',
    '/404.html',
    '/assets/css/style.css?v=9708b8219fa0',
    '/assets/js/script.js?v=b12af89566b0',
    '/assets/js/homepage.js?v=a0cc61146d02',
    '/assets/js/archive.js?v=1a10e039dbee',
    '/assets/js/search.js?v=0d82baee938d',
    '/posts/all-posts.json',
    '/posts/search-index.json',
];

const DYNAMIC_JSON_PATHS = new Set([
    '/posts/all-posts.json',
    '/posts/search-index.json',
]);

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            )
        )
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin === self.location.origin && DYNAMIC_JSON_PATHS.has(requestUrl.pathname)) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        throw error;
    }
}
