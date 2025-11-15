// Service Worker for Push Notifications
self.addEventListener('install', (event) => {
  console.log('Service Worker installed')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
  event.waitUntil(clients.claim())
})

self.addEventListener('push', (event) => {
  console.log('Push notification received', event)

  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body,
      icon: data.icon || '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        ...data.data
      },
      actions: data.actions || [
        {
          action: 'view',
          title: 'View',
        },
        {
          action: 'close',
          title: 'Close',
        },
      ],
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'ibe160 Food Tracker', options)
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event)

  event.notification.close()

  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/alerts'

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        // Check if there's already a window/tab open
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i]
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus()
          }
        }
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
    )
  }
})
