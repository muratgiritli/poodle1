// YourPoodle Service Worker - Enterprise Web Push & Offline System
const CACHE_NAME = 'yourpoodle-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ================= NATIVE PUSH EVENT (FCM / VAPID / APNs) =================
self.addEventListener('push', (event) => {
  let data = {
    title: 'YourPoodle 🐾',
    body: 'Yeni bir etkileşiminiz var!',
    icon: '/images/poodle_mochi.jpg',
    badge: '/images/poodle_mochi.jpg',
    data: { url: '/', type: 'general' }
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = Object.assign(data, parsed);
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const notifType = (data.data && data.data.type) ? data.data.type : 'general';
  
  // Custom vibration pattern based on urgency
  let vibrationPattern = [200, 100, 200];
  if (notifType === 'vaccine_reminder') {
    vibrationPattern = [300, 150, 300, 150, 400]; // Urgent reminder
  } else if (notifType === 'dm_message') {
    vibrationPattern = [150, 100, 150]; // Friendly ping
  }

  const options = {
    body: data.body,
    icon: data.icon || '/images/poodle_mochi.jpg',
    badge: data.badge || '/images/poodle_mochi.jpg',
    vibrate: vibrationPattern,
    tag: notifType + '_' + (data.data?.timestamp || Date.now()),
    renotify: true,
    requireInteraction: notifType === 'vaccine_reminder', // Keep on screen until acknowledged
    data: data.data || { url: '/' },
    actions: [
      { action: 'open', title: 'Uygulamayı Aç 🐾' },
      { action: 'dismiss', title: 'Kapat' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ================= NOTIFICATION CLICK EVENT =================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. If an existing YourPoodle tab is open, focus it and navigate
      for (let client of windowClients) {
        if (client.url.includes('yourpoodle') && 'focus' in client) {
          if ('navigate' in client && targetUrl !== '/') {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // 2. Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ================= AUTOMATIC RESUBSCRIPTION ON KEY REFRESH =================
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    fetch('/api/live/push/vapid-public-key')
      .then(res => res.json())
      .then(keyData => {
        if (!keyData.publicKey) return;
        return self.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: keyData.publicKey
        });
      })
      .then(subscription => {
        if (!subscription) return;
        return fetch('/api/live/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: subscription.toJSON(), username: 'auto_renew' })
        });
      })
      .catch(err => console.error('[SW] pushsubscriptionchange failed:', err))
  );
});
