const CACHE_NAME = 'kawaiiblog-cache-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/pages/archive.html',
    '/pages/about.html',
    '/pages/contact.html',
    '/pages/uses.html',
    '/pages/search.html',
    '/404.html',
    '/assets/css/style.css',
    '/assets/js/script.js',
    '/assets/js/homepage.js',
    '/assets/js/archive.js',
    '/assets/js/search.js',
    '/posts/all-posts.json',
];

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

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
