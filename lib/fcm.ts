import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Unsubscribe,
} from "firebase/messaging";
import { app } from "@/lib/firebase";

export async function getBrowserFcmToken(askPermission: boolean) {
  try {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      return null;
    }

    if (!(await isSupported())) {
      return null;
    }

    let permission = Notification.permission;

    if (permission === "default" && askPermission) {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {
      return null;
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    if (!vapidKey) {
      throw new Error("Firebase VAPID key is missing");
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    await navigator.serviceWorker.ready;

    return getToken(getMessaging(app), {
      vapidKey,
      serviceWorkerRegistration: registration,
    });
  } catch (error) {
    console.error("Failed to get FCM token:", error);
    return null;
  }
}

export async function subscribeToForegroundMessages(
  callback: (payload: MessagePayload) => void,
): Promise<Unsubscribe | null> {
  try {
    if (typeof window === "undefined" || !(await isSupported())) {
      return null;
    }

    return onMessage(getMessaging(app), callback);
  } catch (error) {
    console.error("Failed to subscribe to foreground messages:", error);
    return null;
  }
}
