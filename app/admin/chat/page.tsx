"use client";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: number;
  read: boolean;
  userName?: string;
}

interface ChatUser {
  userId: string;
  userName: string;
  lastMessage: string;
  lastTime: number;
  unread: number;
}

export default function AdminChatPage() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const filteredChatUsers = chatUsers.filter((user) => {
    if (!searchQuery.trim()) return true;
    return user.userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "chats"),
      async (snapshot) => {
        const users: ChatUser[] = [];

        for (const chatDoc of snapshot.docs) {
          const userId = chatDoc.id;
          const data = chatDoc.data();

          try {
            const msgSnapshot = await getDocs(
              query(
                collection(db, "chats", userId, "messages"),
                orderBy("timestamp", "asc"),
              ),
            );

            const msgs = msgSnapshot.docs.map((d) => d.data());

            if (msgs.length === 0) continue;

            const last = msgs[msgs.length - 1];
            const unread = msgs.filter(
              (m) => m.sender === "user" && !m.read,
            ).length;

            users.push({
              userId,
              userName: data.userName || last.userName || "User",
              lastMessage: last.text || "",
              lastTime: last.timestamp?.toMillis?.() || Date.now(),
              unread,
            });
          } catch {
            continue;
          }
        }

        users.sort((a, b) => b.lastTime - a.lastTime);
        setChatUsers(users);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const q = query(
      collection(db, "chats", selectedUser, "messages"),
      orderBy("timestamp", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((d) => ({
        id: d.id,
        text: d.data().text,
        sender: d.data().sender,
        timestamp: d.data().timestamp?.toMillis?.() || Date.now(),
        read: d.data().read || false,
        userName: d.data().userName,
      }));

      setMessages(msgs);

      snapshot.docs.forEach(async (d) => {
        if (d.data().sender === "user" && !d.data().read) {
          await updateDoc(
            doc(db, "chats", selectedUser, "messages", d.id),
            { read: true },
          );
        }
      });
    });

    return () => unsubscribe();
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const messageText = text.trim();
    setText("");

    await addDoc(
      collection(db, "chats", selectedUser, "messages"),
      {
        text: messageText,
        sender: "admin",
        timestamp: serverTimestamp(),
        read: false,
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSelectUser = (userId: string, userName: string) => {
    setSelectedUser(userId);
    setSelectedUserName(userName);
    setMessages([]);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setSelectedUserName("");
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`flex flex-col border-r border-gray-200 bg-white w-full md:w-72 ${
          selectedUser ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="border-b border-gray-100 px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900">Customer Chats</h1>
          <p className="text-xs text-gray-400">
            {filteredChatUsers.length} of {chatUsers.length} conversations
          </p>
        </div>

        <div className="px-3 py-2 border-b border-gray-100">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400 transition"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChatUsers.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-400">
                {searchQuery ? "No users match your search" : "No chats yet"}
              </p>
            </div>
          )}

          {filteredChatUsers.map((user) => (
            <button
              key={user.userId}
              type="button"
              onClick={() => handleSelectUser(user.userId, user.userName)}
              className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 ${
                selectedUser === user.userId ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                {user.userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.userName}
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {formatTime(user.lastTime)}
                  </span>
                </div>
                <p className="truncate text-xs text-gray-500">
                  {user.lastMessage}
                </p>
              </div>
              {user.unread > 0 && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  {user.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`flex flex-1 flex-col w-full ${
          selectedUser ? "flex" : "hidden md:flex"
        }`}
      >
        {!selectedUser ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto mb-3 h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="text-sm font-medium text-gray-500">
                Select a conversation
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition md:hidden"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                {selectedUserName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedUserName}</p>
                <p className="text-xs text-gray-400">Customer</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-sm rounded-xl px-4 py-2 text-sm ${
                      m.sender === "admin"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-3 border-t border-gray-200 bg-white px-4 py-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a reply..."
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!text.trim()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}