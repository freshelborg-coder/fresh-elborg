// Service worker: fast opening + offline fallback.
// - Images / fonts / built JS+CSS: cache-first (instant, no network)
// - Pages (HTML): stale-while-revalidate (opens instantly, refreshes in the background)
// - /api/*: never cached
const CACHE = "fresh-alburj-v4";
const SHELL = ["/", "/icons/icon-192.png", "/icons/icon-512.png"];
const MAX_ENTRIES = 250;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

async function trim(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_ENTRIES) await Promise.all(keys.slice(0, keys.length - MAX_ENTRIES).map((k) => cache.delete(k)));
}

const isStatic = (u, req) =>
  u.pathname.startsWith("/_next/static/") ||
  u.pathname.startsWith("/products/") ||
  u.pathname.startsWith("/banners/") ||
  u.pathname.startsWith("/splash/") ||
  u.pathname.startsWith("/icons/") ||
  ["image", "font", "style", "script"].includes(req.destination);

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.startsWith("/api/")) return;

  if (isStatic(url, req)) {
    e.respondWith(
      caches.match(req).then((hit) => {
        if (hit) return hit;
        return fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy).then(() => trim(c))).catch(() => {});
          }
          return res;
        });
      })
    );
    return;
  }

  // pages: show the cached copy immediately, update it in the background
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => hit || caches.match("/"));
      return hit || net;
    })
  );
});
