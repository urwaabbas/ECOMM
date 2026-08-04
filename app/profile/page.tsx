"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || "");
          setRole(data.role || "user");
          setCreatedAt(data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "");
        }
      } catch (err) {}
    };
    if (session) fetchProfile();
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Account Profile</h1>
        <p className="text-gray-600 text-center mb-8 text-sm">Manage your personal account details and preferences.</p>

        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md border border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Account Role</p>
              <p className="text-sm font-bold text-gray-900 capitalize">{role}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Member Since</p>
              <p className="text-sm font-bold text-gray-900">{createdAt || "N/A"}</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-md bg-orange-500 py-3 text-white font-semibold transition-colors hover:bg-orange-600 disabled:opacity-50 mt-2"
            >
              {status === "loading" ? "Saving Changes..." : "Save Changes"}
            </button>

            {status === "success" && (
              <p className="text-sm font-medium text-green-600 text-center mt-2">Profile updated successfully!</p>
            )}
            {status === "error" && (
              <p className="text-sm font-medium text-red-600 text-center mt-2">{errorMsg || "Failed to update profile."}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}