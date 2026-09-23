importScripts("/assets/-dy/config.js?v=6-17-2024");
importScripts("/assets/-dy/worker.js?v=6-17-2024");
importScripts("/assets/ultraviolet/uv.bundle.js");
importScripts("/assets/-uv/config.js?v=7");
importScripts(__uv$config.sw || "/assets/ultraviolet/uv.sw.js");

const uv = new UVServiceWorker();
const dynamic = new Dynamic();

const userKey = new URL(location).searchParams.get("userkey");
self.dynamic = dynamic;

self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    (async () => {
      if (await dynamic.route(event)) {
        return await dynamic.fetch(event);
      }

      if (event.request.url.startsWith(`${location.origin}/uv/`)) {
        return await uv.fetch(event);
      }

      return await fetch(event.request);
    })(),
  );
});
