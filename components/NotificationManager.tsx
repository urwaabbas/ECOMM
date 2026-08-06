"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getBrowserFcmToken, subscribeToForegroundMessages } from "@/lib/fcm";

interface ToastNotification {
  title: string;
  message: string;
  link: string;
}

export default function NotificationManager() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [enabling, setEnabling] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const toastRef = useRef<((t: ToastNotification) => void) | null>(null);

  const userId = (session?.user as { id?: string } | undefined)?.id;

  toastRef.current = (t: ToastNotification) => {
    setToast(t);
  };

  const saveToken = async (token: string) => {
    if (!userId) {
      return false;
    }

    const storageKey = `haanli-fcm-token:${userId}`;
    const savedToken = localStorage.getItem(storageKey);

    if (savedToken === token) {
      return true;
    }

    const response = await fetch("/api/user/fcm-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to save FCM token");
    }

    localStorage.setItem(storageKey, token);
    return true;
  };

  const enableNotifications = async () => {
    try {
      setEnabling(true);

      const token = await getBrowserFcmToken(true);

      if (!token) {
        setShowPermissionPrompt(false);
        return;
      }

      await saveToken(token);
      setShowPermissionPrompt(false);
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    } finally {
      setEnabling(false);
    }
  };

  useEffect(() => {
    if (status !== "authenticated" || !userId) {
      return;
    }

    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    if (Notification.permission === "default") {
      setShowPermissionPrompt(true);
      return;
    }

    if (Notification.permission === "granted") {
      getBrowserFcmToken(false).then((token) => {
        if (token) {
          saveToken(token).catch((error) => {
            console.error("Failed to sync FCM token:", error);
          });
        }
      });
    }
  }, [status, userId]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    let unsubscribe: (() => void) | null = null;

    subscribeToForegroundMessages((payload) => {
      console.log("FCM payload received:", payload);
      const data = payload.data || {};
      const title = data.title || "Haanli Bazaar";
      const message = data.body || "You have a new notification.";
      const link = data.link || "/";

      if (toastRef.current) {
        toastRef.current({ title, message, link });
      }
    }).then((listener) => {
      unsubscribe = listener;
    });

    return () => {
      unsubscribe?.();
    };
  }, [status]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 7000);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <>
      {showPermissionPrompt && (
        <div className="fixed bottom-5 left-5 z-[100] w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <p className="text-sm font-semibold text-gray-900">
            Enable order notifications
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Receive order and account updates while using another tab.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={enableNotifications}
              disabled={enabling}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {enabling ? "Enabling..." : "Enable"}
            </button>
            <button
              onClick={() => setShowPermissionPrompt(false)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {toast && (
        <button
          onClick={() => {
            setToast(null);
            router.push(toast.link);
          }}
          className="fixed right-5 top-5 z-[110] w-80 rounded-xl border border-blue-100 bg-white p-4 text-left shadow-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gray-900">{toast.title}</p>
              <p className="mt-1 text-xs leading-5 text-gray-600">
                {toast.message}
              </p>
            </div>
            <span
              onClick={(event) => {
                event.stopPropagation();
                setToast(null);
              }}
              className="text-sm text-gray-400"
            >
              ×
            </span>
          </div>
        </button>
      )}
    </>
  );
}
