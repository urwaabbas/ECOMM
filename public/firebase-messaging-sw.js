importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBs3rKzMmGYrXUguQ9nD4uWj7JGYJ5g3pQ",
  authDomain: "haanli-bazaar.firebaseapp.com",
  projectId: "haanli-bazaar",
  storageBucket: "haanli-bazaar.firebasestorage.app",
  messagingSenderId: "392734256997",
  appId: "1:392734256997:web:5379a67e7a76e465923b8c",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || payload.notification || {};
  const title = data.title || "Haanli Bazaar";
  const body = data.body || data.message || "You have a new notification.";
  const link = data.link || "/";

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: { link },
  });
});

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  const payload = data.data || data.notification || {};
  const title = payload.title || "Haanli Bazaar";
  const body = payload.body || payload.message || "You have a new notification.";
  const link = payload.link || "/";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/favicon.ico",
      data: { link },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const link = event.notification.data?.link || "/";
  const targetUrl = new URL(link, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});