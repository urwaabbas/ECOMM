"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: number;
  read: boolean;
}

export default function ChatBox() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const userId = (session?.user as { id?: string } | undefined)?.id;
  const userName = session?.user?.name || "User";

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "chats", userId, "messages"),
      orderBy("timestamp", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((d) => ({
        id: d.id,
        text: d.data().text,
        sender: d.data().sender,
        timestamp: d.data().timestamp?.toMillis?.() || Date.now(),
        read: d.data().read || false,
      }));

      setMessages(msgs);

      const unreadCount = msgs.filter(
        (m) => m.sender === "admin" && !m.read,
      ).length;
      setUnread(unreadCount);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!open || !userId) return;

    messages.forEach(async (m) => {
      if (m.sender === "admin" && !m.read) {
        await updateDoc(
          doc(db, "chats", userId, "messages", m.id),
          { read: true },
        );
      }
    });

    setUnread(0);
  }, [open, messages, userId]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!text.trim() || !userId) return;

    const messageText = text.trim();
    setText("");

    await setDoc(
      doc(db, "chats", userId),
      { userId, userName, updatedAt: serverTimestamp() },
      { merge: true },
    );

    await addDoc(collection(db, "chats", userId, "messages"), {
      text: messageText,
      sender: "user",
      timestamp: serverTimestamp(),
      read: false,
      userName,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div className="fixed bottom-5 right-5 z-[200]">
      {open && (
        <div className="mb-3 flex w-[calc(100vw-2.5rem)] md:w-80 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between bg-indigo-600 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-white">Haanli Bazaar Support</p>
              <p className="text-xs text-indigo-200">We typically reply within minutes</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white hover:text-indigo-200"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex h-60 md:h-72 flex-col gap-2 overflow-y-auto p-4"> 
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-sm text-gray-400">
                  Send us a message and we will get back to you shortly.
                </p>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-gray-100 p-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-400"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!text.trim()}
              className="rounded-lg bg-indigo-600 p-2 text-white transition hover:bg-indigo-700 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg transition hover:bg-indigo-700"
      >
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
        {open ? (
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}