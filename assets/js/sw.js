const CACHE_NAME = 'kawaii-blog-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/archive.html',
  '/assets/about.html',
  '/assets/style.css',
  'assets/contact.html',
  '/assets/js/homepage.js',
  '/assets/js/archive.js',
  '/assets/js/site-config.js',
  '/assets/js/script.js',
  '/posts/all-posts.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});