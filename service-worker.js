// index.html의 appVersion과 항상 같이 올릴 것 — 버전이 바뀌면 캐시 이름도 바뀌어서
// activate 단계에서 이전 캐시가 자동으로 지워지고 새로 받아온다.
const APP_VERSION = "2.10.8";
const CACHE_NAME = "travel-passport-v" + APP_VERSION;
const SHELL_FILES = ["./", "./index.html", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});
