'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "23d359c49f7fc78d0decb9a91f9407b3",
"assets/bier.jpg": "f4bd1981215ef2d2babad0dd5753ed54",
"assets/donald.gif": "160726b6b6830011afcb24de0a30c4fd",
"assets/envelop.jpg": "f47a976a167493363112303c6b92aef9",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/gewonnen.gif": "57d7bf7de8e14574e4d21387b595bcdd",
"assets/glow.jpg": "6c9ea9b1e218f5933f9d1c6babcd8630",
"assets/kado-tip.jpg": "71a9565dd2eac360ef409294be3efc13",
"assets/kraslot0.jpg": "98ef15f0ddf850a7d5b770685f2eee40",
"assets/kraslot1.jpg": "c06046e37e4dab610ea33490ec3d84c6",
"assets/kraslot2.jpg": "7795c87a46a2c90d76f21907503f6e78",
"assets/kraslot3.jpg": "6c2fed2f961f38bfa4f62cc5d5592370",
"assets/NOTICES": "e9842beb9b216604191ec1aeff77f987",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/parkeerplaatsen.jpg": "56035f88a81231576ddcd2d6d2c12cb1",
"assets/prijs.gif": "458c5768ba259450df7dea9e6717583e",
"assets/rgb-cafe.jpg": "f7d71408401b9c174e1ca5b92134ae42",
"assets/rgb-feest.jpg": "ce295788967f4547345c68de42e3b244",
"assets/shaders/ink_sparkle.frag": "b80c1a87a5b19f482a776d94c7c2bbd1",
"assets/silentdisco.jpg": "d5af984227162bbbb1f19ac1735a94b7",
"assets/web/assets/bier.jpg": "f4bd1981215ef2d2babad0dd5753ed54",
"assets/web/assets/donald.gif": "160726b6b6830011afcb24de0a30c4fd",
"assets/web/assets/envelop.jpg": "f47a976a167493363112303c6b92aef9",
"assets/web/assets/gewonnen.gif": "57d7bf7de8e14574e4d21387b595bcdd",
"assets/web/assets/glow.jpg": "6c9ea9b1e218f5933f9d1c6babcd8630",
"assets/web/assets/kado-tip.jpg": "71a9565dd2eac360ef409294be3efc13",
"assets/web/assets/kraslot0.jpg": "98ef15f0ddf850a7d5b770685f2eee40",
"assets/web/assets/kraslot1.jpg": "c06046e37e4dab610ea33490ec3d84c6",
"assets/web/assets/kraslot2.jpg": "7795c87a46a2c90d76f21907503f6e78",
"assets/web/assets/kraslot3.jpg": "6c2fed2f961f38bfa4f62cc5d5592370",
"assets/web/assets/parkeerplaatsen.jpg": "56035f88a81231576ddcd2d6d2c12cb1",
"assets/web/assets/prijs.gif": "458c5768ba259450df7dea9e6717583e",
"assets/web/assets/rgb-cafe.jpg": "f7d71408401b9c174e1ca5b92134ae42",
"assets/web/assets/rgb-feest.jpg": "ce295788967f4547345c68de42e3b244",
"assets/web/assets/silentdisco.jpg": "d5af984227162bbbb1f19ac1735a94b7",
"assets/web/assets/wijn.jpg": "b73a951bc37937ef35b891265f298e66",
"assets/web/assets/wijn.pdn": "326e071cbae7b31975c447e5cae650b8",
"assets/wijn.jpg": "b73a951bc37937ef35b891265f298e66",
"assets/wijn.pdn": "326e071cbae7b31975c447e5cae650b8",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"index.html": "f65af8cd451db4481c634bc5ac05d491",
"/": "f65af8cd451db4481c634bc5ac05d491",
"main.dart.js": "c29a9857c34a80ab5a690c28d5448ed6",
"version.json": "d5b7947ffd103ca2cc5fb8df3bd0d622"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
