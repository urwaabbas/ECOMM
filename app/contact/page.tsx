"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Contact Us</h1>
        <p className="text-gray-600 text-center mb-8 text-sm">Have a question or feedback? Drop us a message below.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-orange-500 py-3 text-white font-semibold transition-colors hover:bg-orange-600 disabled:opacity-50 mt-2"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p className="text-sm font-medium text-green-600 text-center mt-2">Your message has been sent successfully!</p>
          )}
          {status === "error" && (
            <p className="text-sm font-medium text-red-600 text-center mt-2">Failed to send message. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}