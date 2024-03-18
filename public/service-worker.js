var cacheName = "post-school-v1";
var cacheFiles = [
    "index.html",
    "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/pic/accounting.png",
    "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/pic/astronomy.png",
    "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/pic/business.png",
    "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/pic/coding.png",
    "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/pic/culinary.png",
    "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/pic/engineering.png",
    "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/pic/health.png",
    "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/pic/math.png",
    "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/pic/science.png",
    "https://post-school-env.eba-ezt3sksp.eu-west-2.elasticbeanstalk.com/pic/sports.png"
];
self.addEventListener("install", function (e) {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[Service Worker] Caching files");
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener("fetch", function (e) {
    e.respondWith(
        caches.match(e.request).then(function (cachedFile) {
            //if the file is in the cache, retrieve it from there
            if (cachedFile) {
                console.log("[Service Worker] Resource fetched from the cache for: " + e.request.url);

                return cachedFile;
            } else {//if the file is not in the cache, download the file
                return fetch(e.request).then(function (response) {

                    return caches.open(cacheName).then(function (cache) {
                        //add the new file to the cache
                        cache.put(e.request, response.clone());
                        console.log("[Service Worker] Resource fetched and saved in the cache for: " + e.request.url);

                        return response;
                    });
                });
            }
        })
    );
});