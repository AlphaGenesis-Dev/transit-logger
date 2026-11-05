const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('atl_sw') : null;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', e => {
  const action = e.action || 'open';
  e.notification.close();
  e.waitUntil((async () => {
    if (bc && action !== 'open') bc.postMessage({ type: 'ATL_ACTION', action });
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) {
      c.postMessage({ type: 'ATL_ACTION', action });
      if (action === 'open' && 'focus' in c) return c.focus();
    }
    if (action === 'open' && self.clients.openWindow) {
      return self.clients.openWindow('./transit-logger-v1.4.html');
    }
  })());
});
