self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'assets/icons/icon-512x512.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        { action: 'explore', title: 'Go to the site' },
        { action: 'close', title: 'Close the notification' }
      ]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    const action = event.action;
    if (action === 'close') {
      event.notification.close();
    } else {
      clients.openWindow('/');
      event.notification.close();
    }
  });
  