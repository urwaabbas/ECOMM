"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserFcmToken } from "@/lib/fcm";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function relativeTime(value: string) {
  const difference = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function notificationLink(type: string) {
  if (type === "new_order") return "/admin/orders";
  if (type === "low_stock") return "/admin/products";
  if (type === "contact") return "/admin";
  return "/admin";
}

export default function AdminNotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const [enablingPush, setEnablingPush] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/notifications", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch notifications");
      }

      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const interval = window.setInterval(
      fetchNotifications,
      30000,
    );

    return () => window.clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      setPushEnabled(true);
    }
  }, []);

  const enablePush = async () => {
    try {
      setEnablingPush(true);

      const token = await getBrowserFcmToken(true);

      if (!token) {
        return;
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

      setPushEnabled(true);
    } catch (error) {
      console.error("Failed to enable admin push:", error);
    } finally {
      setEnablingPush(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingRead(true);

      const response = await fetch(
        "/api/admin/notifications",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to mark notifications");
      }

      setNotifications((items) =>
        items.map((item) => ({
          ...item,
          isRead: true,
        })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    } finally {
      setMarkingRead(false);
    }
  };

  const openNotification = async (
    notification: NotificationItem,
  ) => {
    if (!notification.isRead) {
      fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: notification._id,
        }),
      }).catch(() => undefined);

      setNotifications((items) =>
        items.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    }

    setOpen(false);
    router.push(notificationLink(notification.type));
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((value) => !value);

          if (!open) {
            fetchNotifications();
          }
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
        aria-label="Open notifications"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-gray-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <span className="text-sm font-bold text-gray-800">
              Notifications
            </span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
              {unreadCount} New
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-xs text-gray-400">
                Loading notifications...
              </p>
            )}

            {!loading && notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-xs text-gray-400">
                No notifications yet
              </p>
            )}

            {notifications.map((notification) => (
              <button
                key={notification._id}
                onClick={() => openNotification(notification)}
                className={`w-full border-b border-gray-50 px-4 py-3 text-left hover:bg-gray-50 ${
                  notification.isRead ? "" : "bg-blue-50/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-800">
                    {notification.title}
                  </p>
                  <span className="shrink-0 text-[10px] text-gray-400">
                    {relativeTime(notification.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {notification.message}
                </p>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2">
            <button
              onClick={enablePush}
              disabled={pushEnabled || enablingPush}
              className="text-xs font-semibold text-emerald-600 disabled:text-gray-400"
            >
              {pushEnabled
                ? "Push enabled"
                : enablingPush
                  ? "Enabling..."
                  : "Enable push"}
            </button>

            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || markingRead}
              className="text-xs font-semibold text-blue-600 disabled:text-gray-400"
            >
              {markingRead ? "Updating..." : "Mark all as read"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
