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
  setDoc,
  deleteDoc,
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

interface DbUser {
  _id: string;
  name: string;
  email: string;
}

export default function AdminChatPage() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [dbUsers, setDbUsers] = useState<DbUser[]>([]);
  const [dbSearch, setDbSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
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

  const fetchDbUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users?page=1&limit=100");
      const data = await res.json();
      if (data.success) {
        setDbUsers(data.users.filter((u: any) => u.role !== "admin"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleNewChat = async (user: DbUser) => {
    await setDoc(
      doc(db, "chats", user._id),
      { userId: user._id, userName: user.name, updatedAt: serverTimestamp() },
      { merge: true },
    );

    setSelectedUser(user._id);
    setSelectedUserName(user.name);
    setMessages([]);
    setShowNewChat(false);
    setDbSearch("");
  };

  const deleteChat = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this entire conversation?")) return;

    try {
      const msgSnapshot = await getDocs(
        collection(db, "chats", userId, "messages"),
      );

      await Promise.all(
        msgSnapshot.docs.map((d) =>
          deleteDoc(doc(db, "chats", userId, "messages", d.id)),
        ),
      );

      await deleteDoc(doc(db, "chats", userId));

      if (selectedUser === userId) {
        setSelectedUser(null);
        setSelectedUserName("");
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

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

  const filteredDbUsers = dbUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(dbSearch.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`flex flex-col bg-white border-r border-gray-100 w-full md:w-72 ${
          selectedUser ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base font-bold text-gray-900">Messages</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {filteredChatUsers.length} conversations
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowNewChat(true);
                fetchDbUsers();
              }}
              className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Chat
            </button>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-300 transition"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChatUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p className="text-xs text-gray-400">
                {searchQuery ? "No conversations found" : "No chats yet"}
              </p>
            </div>
          )}

          {filteredChatUsers.map((user) => (
            <div
              key={user.userId}
              className={`flex items-center border-b border-gray-50 hover:bg-gray-50 transition group ${
                selectedUser === user.userId ? "bg-indigo-50 border-l-2 border-l-indigo-500" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => handleSelectUser(user.userId, user.userName)}
                className="flex flex-1 items-center gap-3 px-4 py-3 text-left min-w-0"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                  {user.userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.userName}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                      {formatTime(user.lastTime)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {user.lastMessage || "Start a conversation"}
                  </p>
                </div>
                {user.unread > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    {user.unread}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(user.userId);
                }}
                className="opacity-0 group-hover:opacity-100 transition mr-3 h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                title="Delete conversation"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                </svg>
              </button>
            </div>
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
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">Select a conversation</p>
              <p className="text-xs text-gray-400 mt-1">or start a new chat with any user</p>
              <button
                type="button"
                onClick={() => { setShowNewChat(true); fetchDbUsers(); }}
                className="mt-4 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                + New Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition md:hidden"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                {selectedUserName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{selectedUserName}</p>
                <p className="text-xs text-gray-400">Customer</p>
              </div>
              <button
                type="button"
                onClick={() => selectedUser && deleteChat(selectedUser)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                title="Delete conversation"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 gap-2">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400">No messages yet. Say hello!</p>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 items-end ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs font-semibold text-gray-600">
                      {selectedUserName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.sender === "admin"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.sender === "admin" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white">
                      A
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-3 border-t border-gray-100 bg-white px-4 py-3">
              <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a reply..."
                  className="flex-1 border-none outline-none text-sm text-gray-900 placeholder-gray-400 py-2 bg-transparent"
                />
              </div>
              <button
                type="button"
                onClick={sendMessage}
                disabled={!text.trim()}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-40 shrink-0"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13M22 2 15 22 11 13M11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {showNewChat && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowNewChat(false); setDbSearch(""); } }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">New Conversation</h2>
                <p className="text-xs text-gray-400 mt-0.5">Select a user to start chatting</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowNewChat(false); setDbSearch(""); }}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="px-4 py-3 border-b border-gray-50">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </span>
                <input
                  type="text"
                  value={dbSearch}
                  onChange={(e) => setDbSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-300 transition"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {loadingUsers ? (
                <div className="flex items-center justify-center py-10">
                  <p className="text-sm text-gray-400">Loading users...</p>
                </div>
              ) : filteredDbUsers.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <p className="text-sm text-gray-400">No users found</p>
                </div>
              ) : (
                filteredDbUsers.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => handleNewChat(user)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <div className="ml-auto">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}