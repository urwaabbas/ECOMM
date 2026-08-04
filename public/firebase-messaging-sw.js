importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBs3rKzMmGYrXUguQ9nD4uWj7JGYJ5g3pQ",
  authDomain: "haanli-bazaar.firebaseapp.com",
  projectId: "haanli-bazaar",
  storageBucket: "haanli-bazaar.firebasestorage.app",
  messagingSenderId: "392734256997",
  appId: "1:392734256997:web:5379a67e7a76e465923b8c",
  measurementId: "G-165H92FVKP"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});