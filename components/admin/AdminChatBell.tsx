"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminChatBell() {
  const router = useRouter();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const chatsRef = collection(db, "chats");

    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      const unsubscribers: (() => void)[] = [];
      const unreadCounts: Record<string, number> = {};

      snapshot.docs.forEach((chatDoc) => {
        const userId = chatDoc.id;

        const unreadQuery = query(
          collection(db, "chats", userId, "messages"),
          where("sender", "==", "user"),
          where("read", "==", false),
        );

        const unsub = onSnapshot(unreadQuery, (msgSnapshot) => {
          unreadCounts[userId] = msgSnapshot.size;
          const total = Object.values(unreadCounts).reduce(
            (sum, count) => sum + count,
            0,
          );
          setUnread(total);
        });

        unsubscribers.push(unsub);
      });

      return () => {
        unsubscribers.forEach((unsub) => unsub());
      };
    });

    return () => unsubscribe();
  }, []);

  return (
    <button
      type="button"
      onClick={() => router.push("/admin/chat")}
      className="relative w-9 h-9 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>

      {unread > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
}