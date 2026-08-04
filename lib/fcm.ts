import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { app } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
    const supported = await isSupported();
    if (!supported) return null;

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;
    } else if (Notification.permission !== "granted") {
      return null;
    }

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch (error) {
    return null;
  }
};

export const onMessageListener = async () => {
  const supported = await isSupported();
  if (!supported) return null;

  const messaging = getMessaging(app);

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
