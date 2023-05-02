const CACHE_NAME = "KanBan-static-v3";
const DYNAMIC_CACHE_NAME = "KanBan-dynamic-v2"
const STATIC_CACHE_URLS = [
   "/",
   "/index.html",
   "/firebaseConfig.js",
   "/style.css",
   "/common/Logo_dark_inverted192.png",
   "/FallbackPage/index.html",
   "/FallbackPage/style.css"
];

//Install event
self.addEventListener("install", event => {
   //Precaching
   event.waitUntil(caches.open(CACHE_NAME)
      .then(cache => {
         console.log("Caching assets...");
         cache.addAll(STATIC_CACHE_URLS);
      })
   );
   
});

//Activate event
self.addEventListener("activate", event => {
   //Delete all old caches when sw changes
   event.waitUntil(
      caches.keys().then(keys => {
         return Promise.all(
            keys.filter(key => key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME).map(key => caches.delete(key))
         )
      })
   );
});

//fetch event
self.addEventListener("fetch", event => {
   //Answers with cached file if existing, fetches it otherwise.
   event.respondWith(
      caches.match(event.request).then(cacheResponse => {
         return cacheResponse || fetch(event.request).then(fetchResponse => {
            return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
               cache.put(event.request.url, fetchResponse.clone());
               return fetchResponse;
            })
         }); 
      }).catch(() => caches.match("/FallbackPage/index.html"))
   );
});