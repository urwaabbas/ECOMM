"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { requestNotificationPermission } from "@/lib/fcm";

export default function NotificationProvider() {
  const { data: session } = useSession();

  useEffect(() => {
    const setupNotifications = async () => {
      const token = await requestNotificationPermission();
      
      if (token && session?.user?.id) {
        await fetch("/api/user/fcm-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
      }
    };

    setupNotifications();
  }, [session]);

  return null;
}