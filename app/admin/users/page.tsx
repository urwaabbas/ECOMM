"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      if ((session?.user as any)?.role !== "admin") {
        router.push("/");
        return;
      }

      const fetchUsers = async () => {
        try {
          const res = await fetch("/api/admin/users");
          const data = await res.json();
          if (data.success) setUsers(data.users);
        } catch (err) {
          console.error("Failed to fetch users:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [session, status, router]);
  const updateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
        );
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} registered users
          </p>
        </div>

        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user._id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        user.role === "admin"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        user.isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {user.role === "admin" ? (
                      <button
                        onClick={() => updateRole(user._id, "user")}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg transition"
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => updateRole(user._id, "admin")}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg transition"
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    user.role === "admin"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{user.email}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    user.isVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.isVerified ? "Verified" : "Unverified"}
                </span>
                <p className="text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() =>
                    updateRole(
                      user._id,
                      user.role === "admin" ? "user" : "admin",
                    )
                  }
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                    user.role === "admin"
                      ? "text-red-500 border-red-200 hover:text-red-700"
                      : "text-indigo-600 border-indigo-200 hover:text-indigo-700"
                  }`}
                >
                  {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
