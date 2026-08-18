"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What products do you have?",
  "Recommend electronics under PKR 50,000",
  "What is your return policy?",
  "Show me fitness products",
  "Where is my order?",
];

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

export default function AIAssistant() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "G";

  const firstName = session?.user?.name
    ? session.user.name.split(" ")[0]
    : null;

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hi${firstName ? ` ${firstName}` : ""}! I'm Wazir, your personal shopping assistant. What can I help you find today?`,
        },
      ]);
    }
  }, [open, session]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const buildHistory = () => {
    return messages.slice(1).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: buildHistory() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setError("");
    setInput("");
    setTimeout(() => {
      setMessages([
        {
          role: "assistant",
          content: `Hi${firstName ? ` ${firstName}` : ""}! I'm Wazir, your personal shopping assistant. What can I help you find today?`,
        },
      ]);
    }, 100);
  };

  return (
    <>
      <style>{`
        .wazir-window {
          position: absolute;
          bottom: 72px;
          left: 0;
          width: 340px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .wazir-header {
          padding: 18px 18px 16px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
        }
        .wazir-avatar {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 16px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .wazir-header-text { flex: 1; }
        .wazir-header-name {
          font-size: 14px;
          font-weight: 600;
          color: #111;
          letter-spacing: -0.2px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .wazir-header-status {
          font-size: 12px;
          color: #888;
          margin-top: 1px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .wazir-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
        }
        .wazir-header-actions { display: flex; gap: 4px; }
        .wazir-icon-btn {
          width: 30px;
          height: 30px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          transition: all 0.15s;
        }
        .wazir-icon-btn:hover { background: #f5f5f5; color: #333; }
        .wazir-body {
          height: 320px;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #fafafa;
        }
        .wazir-body::-webkit-scrollbar { width: 4px; }
        .wazir-body::-webkit-scrollbar-track { background: transparent; }
        .wazir-body::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }
        .wazir-msg-row { display: flex; gap: 8px; align-items: flex-end; }
        .wazir-msg-row-user { flex-direction: row-reverse; }
        .wazir-msg-icon {
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
        .wazir-msg-icon-ai {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          color: white;
        }
        .wazir-msg-icon-user {
          background: #f0f0f0;
          color: #555;
        }
        .wazir-bubble {
          max-width: 240px;
          padding: 10px 14px;
          font-size: 14px;
          line-height: 1.55;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.1px;
        }
        .wazir-bubble-ai {
          background: #ffffff;
          color: #111;
          border-radius: 4px 16px 16px 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
        }
        .wazir-bubble-user {
          background: #1a1a2e;
          color: #ffffff;
          border-radius: 16px 4px 16px 16px;
        }
        .wazir-typing {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 12px 16px;
        }
        .wazir-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ccc;
          animation: wdot 1.2s ease-in-out infinite;
          display: inline-block;
        }
        .wazir-typing span:nth-child(2) { animation-delay: 0.2s; }
        .wazir-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes wdot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
        .wazir-error {
          background: #fff1f1;
          border: 1px solid #fecaca;
          color: #dc2626;
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .wazir-suggestions { display: flex; flex-direction: column; gap: 6px; }
        .wazir-suggest-label {
          font-size: 11px;
          font-weight: 600;
          color: #aaa;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 0 2px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .wazir-suggest-btn {
          background: #ffffff;
          border: 1px solid #ebebeb;
          color: #333;
          font-size: 13px;
          padding: 9px 13px;
          cursor: pointer;
          text-align: left;
          border-radius: 10px;
          transition: all 0.15s;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.1px;
        }
        .wazir-suggest-btn:hover {
          background: #f5f5f5;
          border-color: #ddd;
          color: #111;
        }
        .wazir-footer {
          padding: 12px 14px 14px;
          background: #ffffff;
          border-top: 1px solid #f0f0f0;
        }
        .wazir-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f5f5f5;
          border-radius: 12px;
          padding: 4px 4px 4px 12px;
        }
        .wazir-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 14px;
          color: #111;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 6px 0;
          letter-spacing: -0.1px;
        }
        .wazir-input::placeholder { color: #aaa; }
        .wazir-send {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #1a1a2e;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .wazir-send:hover { background: #2d2d4e; transform: scale(1.03); }
        .wazir-send:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
        .wazir-footer-note {
          text-align: center;
          font-size: 11px;
          color: #ccc;
          margin-top: 8px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: 0.1px;
        }
        .wazir-fab {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(26,26,46,0.4), 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s;
          position: relative;
        }
        .wazir-fab:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(26,26,46,0.5); }
        .wazir-fab-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #22c55e;
          border: 2px solid white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 7px;
          font-weight: 700;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .wazir-user-badge {
          position: absolute;
          bottom: -4px;
          left: -4px;
          background: #4f46e5;
          border: 2px solid white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 700;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 200 }}>
        {open && (
          <div className="wazir-window">
            <div className="wazir-header">
              <div className="wazir-avatar">W</div>
              <div className="wazir-header-text">
                <div className="wazir-header-name">Wazir AI</div>
                <div className="wazir-header-status">
                  <span className="wazir-status-dot" />
                  Online — Powered by Groq
                </div>
              </div>
              <div className="wazir-header-actions">
                <button className="wazir-icon-btn" onClick={handleReset} title="New conversation">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
                <button className="wazir-icon-btn" onClick={() => setOpen(false)} title="Close">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="wazir-body">
              {messages.map((m, i) => (
                <div key={i} className={`wazir-msg-row ${m.role === "user" ? "wazir-msg-row-user" : ""}`}>
                  <div className={`wazir-msg-icon ${m.role === "user" ? "wazir-msg-icon-user" : "wazir-msg-icon-ai"}`}>
                    {m.role === "user" ? userInitial : "W"}
                  </div>
                  <div
                    className={`wazir-bubble ${m.role === "user" ? "wazir-bubble-user" : "wazir-bubble-ai"}`}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                  />
                </div>
              ))}

              {loading && (
                <div className="wazir-msg-row">
                  <div className="wazir-msg-icon wazir-msg-icon-ai">W</div>
                  <div className="wazir-bubble wazir-bubble-ai wazir-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              {error && <div className="wazir-error">{error}</div>}

              {messages.length === 1 && !loading && (
                <div className="wazir-suggestions">
                  <div className="wazir-suggest-label">Suggested</div>
                  {suggestions.map((s, i) => (
                    <button key={i} className="wazir-suggest-btn" onClick={() => sendMessage(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="wazir-footer">
              <div className="wazir-input-row">
                <input
                  ref={inputRef}
                  className="wazir-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  maxLength={500}
                />
                <button
                  className="wazir-send"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  aria-label="Send"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2 11 13M22 2 15 22 11 13M11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <div className="wazir-footer-note">Wazir AI · Haanli Bazaar</div>
            </div>
          </div>
        )}

        <button
          className="wazir-fab"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open Wazir AI"
          style={{ position: "relative" }}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="7" width="18" height="13" rx="3" />
              <path d="M8 11h.01M16 11h.01" />
              <path d="M10 15c.5.5 1 .75 2 .75s1.5-.25 2-.75" />
              <path d="M12 3v4" />
              <path d="M9 7V5M15 7V5" />
              <circle cx="9" cy="5" r="1" fill="white" stroke="none" />
              <circle cx="15" cy="5" r="1" fill="white" stroke="none" />
              <circle cx="8" cy="11" r="1.2" fill="white" stroke="none" />
              <circle cx="16" cy="11" r="1.2" fill="white" stroke="none" />
            </svg>
          )}
          <div className="wazir-fab-badge">AI</div>
          {session?.user && (
            <div className="wazir-user-badge">{userInitial}</div>
          )}
        </button>
      </div>
    </>
  );
}