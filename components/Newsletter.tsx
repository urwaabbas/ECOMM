"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="border-b border-gray-800 bg-gray-900 py-12 text-center">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="text-2xl font-bold text-white">Subscribe to our Newsletter</h2>
        <p className="mt-2 text-sm text-gray-400">Get real-time updates and promotional offers directly to your inbox.</p>

        <form onSubmit={handleSubscribe} className="mt-6 flex justify-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full max-w-sm rounded-md bg-white px-4 py-2 text-gray-900 placeholder-gray-500 outline-none"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {status === "loading" ? "Saving..." : "Subscribe"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-3 text-sm font-medium text-green-500">Successfully subscribed to the newsletter!</p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm font-medium text-red-500">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}