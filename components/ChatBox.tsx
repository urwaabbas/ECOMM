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
  const inputRef = useRef<HTMLInputElement>(null);

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
      setTimeout(() => inputRef.current?.focus(), 100);
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

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status !== "authenticated") return null;

  return (
    <>
      <style>{`
        .cb-window {
          position: absolute;
          bottom: 72px;
          right: 0;
          width: 340px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .cb-header {
          padding: 16px 18px;
          background: #6366f1;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cb-header-avatar {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 18px;
        }
        .cb-header-name {
          font-size: 14px;
          font-weight: 600;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cb-header-status {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 1px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cb-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #86efac;
          flex-shrink: 0;
        }
        .cb-close-btn {
          margin-left: auto;
          background: rgba(255,255,255,0.2);
          border: none;
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .cb-close-btn:hover { background: rgba(255,255,255,0.3); }
        .cb-body {
          height: 300px;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #f8f8f8;
        }
        .cb-body::-webkit-scrollbar { width: 4px; }
        .cb-body::-webkit-scrollbar-track { background: transparent; }
        .cb-body::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }
        .cb-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
          padding: 20px;
        }
        .cb-empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: #ede9fe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }
        .cb-empty-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cb-empty-subtitle {
          font-size: 12px;
          color: #999;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cb-msg-row { display: flex; gap: 8px; align-items: flex-end; }
        .cb-msg-row-user { flex-direction: row-reverse; }
        .cb-msg-icon {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 11px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cb-msg-icon-admin { background: #6366f1; color: white; }
        .cb-msg-icon-user { background: #e0e0e0; color: #555; }
        .cb-bubble {
          max-width: 230px;
          padding: 9px 13px;
          font-size: 13.5px;
          line-height: 1.55;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cb-bubble-admin {
          background: white;
          color: #111;
          border-radius: 4px 14px 14px 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
        }
        .cb-bubble-user {
          background: #6366f1;
          color: white;
          border-radius: 14px 4px 14px 14px;
        }
        .cb-time {
          font-size: 10px;
          color: #bbb;
          margin-top: 3px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cb-time-user { text-align: right; }
        .cb-footer {
          padding: 12px 14px 14px;
          background: white;
          border-top: 1px solid #f0f0f0;
        }
        .cb-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f5f5f5;
          border-radius: 12px;
          padding: 4px 4px 4px 12px;
        }
        .cb-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 13.5px;
          color: #111;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 7px 0;
        }
        .cb-input::placeholder { color: #aaa; }
        .cb-send {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #6366f1;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .cb-send:hover { background: #4f46e5; }
        .cb-send:disabled { opacity: 0.35; cursor: not-allowed; }
        .cb-footer-note {
          text-align: center;
          font-size: 11px;
          color: #ccc;
          margin-top: 7px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cb-fab {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: #6366f1;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(99,102,241,0.4), 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s;
          position: relative;
        }
        .cb-fab:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(99,102,241,0.5); }
        .cb-fab-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          border: 2px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 200 }}>
        {open && (
          <div className="cb-window">
            <div className="cb-header">
              
              <div>
                <div className="cb-header-name">Haanli Bazaar Support</div>
                <div className="cb-header-status">
                  <span className="cb-status-dot" />
                  Feel free to contact 
                </div>
              </div>
              <button className="cb-close-btn" onClick={() => setOpen(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="cb-body">
              {messages.length === 0 ? (
                <div className="cb-empty">
                  <div className="cb-empty-icon">👋</div>
                  <div className="cb-empty-title">How can we help?</div>
                  <div className="cb-empty-subtitle">Send us a message and we will get back to you shortly.</div>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id}>
                    <div className={`cb-msg-row ${m.sender === "user" ? "cb-msg-row-user" : ""}`}>
                      <div className={`cb-msg-icon ${m.sender === "user" ? "cb-msg-icon-user" : "cb-msg-icon-admin"}`}>
                        {m.sender === "user" ? "U" : "HB"}
                      </div>
                      <div className={`cb-bubble ${m.sender === "user" ? "cb-bubble-user" : "cb-bubble-admin"}`}>
                        {m.text}
                      </div>
                    </div>
                    <div className={`cb-time ${m.sender === "user" ? "cb-time-user" : ""}`}>
                      {formatTime(m.timestamp)}
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <div className="cb-footer">
              <div className="cb-input-row">
                <input
                  ref={inputRef}
                  className="cb-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                />
                <button
                  className="cb-send"
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  aria-label="Send"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2 11 13M22 2 15 22 11 13M11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
              <div className="cb-footer-note">Haanli Bazaar Support</div>
            </div>
          </div>
        )}

        <button
          className="cb-fab"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open support chat"
        >
          {unread > 0 && !open && (
            <span className="cb-fab-badge">{unread > 9 ? "9+" : unread}</span>
          )}
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}