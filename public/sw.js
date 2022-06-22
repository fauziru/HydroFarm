workbox.core.skipWaiting();
self.addEventListener('push', async (event) => {
  console.log('listener push')
  if (event.data) {
    console.log('Push event!! ', event.data)
    const pushNotif = JSON.parse(event.data.text())
    console.log('Push event!! ', pushNotif)
    const options = {
      body: pushNotif.body,
      icon: pushNotif.icon,
      action: pushNotif.actions[0].action,
      badge: pushNotif.badge
    }
    self.registration.showNotification(pushNotif.title, options)
  } else {
    console.log('Push event but no data')
  }
})
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://hydrofarm.id')
  );
});