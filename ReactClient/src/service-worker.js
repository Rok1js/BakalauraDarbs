/* eslint-env serviceworker */
/* global clients */
console.log('Custom service worker loaded.');
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';


// Precache assets generated by VitePWA
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.skipWaiting();
clientsClaim();
self.clients.claim();

// Runtime caching for API requests using Network First strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      }),
    ],
  })
);

registerRoute(
  ({ url }) =>
    url.origin === 'https://admin.gofinanceapp.lv' &&
      url.pathname.startsWith('/storage/posts/'),
  
  new CacheFirst({
    cacheName: 'external-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200], // 0 for opaque responses
      }),
    ],
  })
);

self.addEventListener('push', (event) => {
  const payload = event.data?.json() || {
    title: 'New Notification',
    body: 'You have updates!',
    icon: '/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: payload.data || {}
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
    
  event.waitUntil(
    clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow(event.notification.data.url || '/');
    })
  );
});

// const requestNotificationPermission = async () => {
//     const permission = await Notification.requestPermission();


// }

// Listen for a message to skip waiting (for manual updates)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// On activation, claim clients and notify them
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      for (const client of clients) {
        client.postMessage({ type: 'NEW_VERSION_AVAILABLE' });
      }
    })()
  );
});