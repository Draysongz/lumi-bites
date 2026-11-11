/* Lumi's Bites service worker — offline shell + installability + push. */
const CACHE = "lumis-bites-v2";
const SHELL = ["/app", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// Network-first for document navigations; cache-first fallback when offline.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Never intercept API routes or cross-origin requests.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && request.mode === "navigate" && url.pathname.startsWith("/app")) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put("/app", clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/app"))),
  );
});

// Push notifications.
self.addEventListener("push", (event) => {
  let data = { title: "Lumi's Bites", body: "You have an update!" };
  try {
    data = event.data ? event.data.json() : data;
  } catch {
    /* non-JSON payload — use defaults */
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url || "/app" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/app";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    }),
  );
});
