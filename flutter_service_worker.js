'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "64715ac31a1f50d532fc9ae8bfee6271",
"assets/assets/de.jpg": "72d6546bf2aeafa28753fe348dbd9dc7",
"assets/assets/en.jpg": "24f4fc07006aa476fb68a2194c71aa5d",
"assets/assets/es.jpg": "164d36a25ec01630c07123fecc051a24",
"assets/assets/fr.jpg": "1ec572af2c088f4d72aec177925f2f44",
"assets/assets/harten.jpg": "dc8a18b463078352701b66c8fd0df48c",
"assets/assets/icon.png": "7f0f1658495e5737d505ebd221248a38",
"assets/assets/klaver.jpg": "e1c3e582ee12c923d3b3a1575bb70923",
"assets/assets/nl.jpg": "b9cb0283ab79d621e1ac68535fa19622",
"assets/assets/ruiten.jpg": "50c6d92f4bd09f18bb891b038d7203e4",
"assets/assets/schoppen.jpg": "388314f36d851be340254e70859d9d20",
"assets/assets/splash.png": "6272309c588fb39cc59ea4c129a1d8a8",
"assets/FontManifest.json": "6393f6044de9b517a173189f06881c1e",
"assets/fonts/arialnb.ttf": "a124283ed04fa46545c082804d5f6680",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "4c5d174105773afc7394f1284b911cd6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "2d0ac481a1f56eac46906375d6c8105e",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"icons/Icon-192.png": "467c33945eb66668371dd8b53f74459b",
"icons/Icon-512.png": "cf2e6eb5920e41fea5f7106065ac9dd1",
"icons/Icon-maskable-192.png": "467c33945eb66668371dd8b53f74459b",
"icons/Icon-maskable-512.png": "cf2e6eb5920e41fea5f7106065ac9dd1",
"index.html": "81b9631a3e5e188e39f5b0cae3551a39",
"/": "81b9631a3e5e188e39f5b0cae3551a39",
"main.dart.js": "2ecd8c50279199bb87f4555f89e8de76",
"manifest.json": "66c3169ec7ecd52d20547a32c3cb6487",
"splash/img/dark-1x.png": "448c1795c87cc7ffc14bf33b873a775d",
"splash/img/dark-2x.png": "972d88614bbccf1b8d69ff9c4b8c3f72",
"splash/img/dark-3x.png": "26e3c97da1631726dc5f1a6a397b4b50",
"splash/img/dark-4x.png": "f9ac6a36ff0e36f0a9091140a20a93c7",
"splash/img/light-1x.png": "448c1795c87cc7ffc14bf33b873a775d",
"splash/img/light-2x.png": "972d88614bbccf1b8d69ff9c4b8c3f72",
"splash/img/light-3x.png": "26e3c97da1631726dc5f1a6a397b4b50",
"splash/img/light-4x.png": "f9ac6a36ff0e36f0a9091140a20a93c7",
"splash/splash.js": "123c400b58bea74c1305ca3ac966748d",
"splash/style.css": "73c6046ea5ceb0220ea78b76becf8a0b",
"version.json": "2fbe2c2ff80bd1d37b64c27e1375d987"
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
