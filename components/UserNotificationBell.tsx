"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface UserNotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationResponse {
  success: boolean;
  notifications?: UserNotification[];
  unreadCount?: number;
  error?: string;
}

function formatTime(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();
  const difference = Date.now() - createdTime;
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(createdAt).toLocaleDateString();
}

function getNotificationLink(type: string) {
  if (type === "order_update") {
    return "/orders";
  }

  if (type === "promotion") {
    return "/products";
  }

  return "/";
}

async function readJsonResponse(
  response: Response,
): Promise<NotificationResponse | null> {
  const contentType =
    response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

export default function UserNotificationBell() {
  const { status } = useSession();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    UserNotification[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (status !== "authenticated") {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/notifications", {
        cache: "no-store",
        credentials: "same-origin",
      });

      const data = await readJsonResponse(response);

      if (!data || !response.ok || !data.success) {
        return;
      }

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
  }, [status, fetchNotifications]);

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener(
        "mousedown",
        closeDropdown,
      );
    };
  }, []);

  const toggleDropdown = () => {
    const nextOpenState = !open;
    setOpen(nextOpenState);

    if (nextOpenState) {
      fetchNotifications();
    }
  };

  const openNotification = async (
    notification: UserNotification,
  ) => {
    if (!notification.isRead) {
      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item,
        ),
      );

      setUnreadCount((currentCount) =>
        Math.max(0, currentCount - 1),
      );

      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            notificationId: notification._id,
          }),
        });
      } catch {
        return;
      }
    }

    setOpen(false);
    router.push(getNotificationLink(notification.type));
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0 || markingAll) {
      return;
    }

    try {
      setMarkingAll(true);

      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({}),
      });

      const data = await readJsonResponse(response);

      if (!data || !response.ok || !data.success) {
        return;
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch {
      return;
    } finally {
      setMarkingAll(false);
    }
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100 hover:text-indigo-600"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-[100] mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-gray-900">
                Notifications
              </p>
              <p className="text-[11px] text-gray-400">
                Your latest account and order updates
              </p>
            </div>

            {unreadCount > 0 && (
              <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-400">
                  Loading notifications...
                </p>
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="px-4 py-8 text-center">
                <svg
                  className="mx-auto mb-2 h-8 w-8 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>

                <p className="text-sm font-medium text-gray-500">
                  No notifications yet
                </p>
              </div>
            )}

            {notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() =>
                  openNotification(notification)
                }
                className={`block w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${
                  notification.isRead
                    ? "bg-white"
                    : "bg-indigo-50/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      notification.isRead
                        ? "bg-gray-300"
                        : "bg-indigo-600"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          notification.isRead
                            ? "font-semibold text-gray-700"
                            : "font-bold text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </p>

                      <span className="shrink-0 text-[10px] text-gray-400">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={fetchNotifications}
              disabled={loading}
              className="text-xs font-semibold text-gray-500 transition hover:text-indigo-600 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || markingAll}
              className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 disabled:text-gray-400"
            >
              {markingAll
                ? "Updating..."
                : "Mark all as read"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}