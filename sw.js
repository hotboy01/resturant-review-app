const cacheName = 'v1';
// Files to be cached are stored in this array
const FilesToCache = [
        '/',
        'index.html',
        'restaurant.html',
        '/css/styles.css',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        '/data/restaurants.json',
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
        '/img/8.jpg',
        '/img/9.jpg',
        '/img/10.jpg'
    ];

/* Event listener to fire when our Service Worker is registered,
 * installation must have completed,
 * then the caches object is used to match a cache name if the name doesn't exist, one is created with the passed cached name.
 * This returns a promise which is associated with a function that adds our cache files to the cache.
 */

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(FilesToCache);
        })
    );
});

/* Event listener with the fetch event,
 * the respondWith method is used to prevent the default fetch event and provide it with a promise
 * A promise is recieved if the event request already exists in the cache that was loaded earlier.
 * Then it is checked if a response kis gotten from the match query:
 * if true the request alredy exist in the cache and it is returned,
 * or else the request doesn't exist in the cache, therefore the file is fetched.
 */

self.addEventListener('fetch', function(e) {
   const clonedRequest = e.request.clone(); //  The request is cloned 
   e.respondWith(
        caches.match(e.request)
        .then(function(response) {
            if (response) {
                return response;
            }   
            else {
                return fetch(clonedRequest)
                .then(function(response) {
                    const responseClone = response.clone(); // The response is cloned
                    caches.open(cacheName).then(function(cache) {
                        cache.put(e.request, responseClone);
                    })
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                });
            }
        })
    );       
});
