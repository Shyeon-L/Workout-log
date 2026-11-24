const CACHE = 'workout-log-v2';
const ASSETS = ['./', './index.html', './manifest.webmanifest',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
    // 새 버전이 활성화되면 열려 있던 화면도 새 버전으로 다시 열어 준다 (기기에 바로 반영)
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      try { await w.navigate(w.url); } catch (_) { /* 열 수 없는 화면은 그대로 둔다 */ }
    }
  })());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // 페이지 이동 요청은 네트워크를 먼저 보고(새 버전 즉시 반영), 실패하면 캐시로
  if (e.request.mode === 'navigate') {
    // 앱 셸(index.html)만 캐시에 갱신해 둔다
    const isShell = /\/$|\/index\.html$/.test(url.pathname);
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' }).then((res) => {
        if (isShell) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
