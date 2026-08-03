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
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

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
      fetchUsers(page);
    }
  }, [session, status, router, page]);

  const fetchUsers = async (pageNumber: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users?page=${pageNumber}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        if (data.totalPages) setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser?._id,
          name: editName,
          email: editEmail,
          role: editRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === editingUser?._id
              ? { ...u, name: editName, email: editEmail, role: editRole }
              : u
          )
        );
        setEditingUser(null);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

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
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage system users and access roles</p>
          </div>
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 px-4 transition-all">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Edit User</h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold transition"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#2563EB] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-xs"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Verified</th>
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="text-left px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.isVerified ? "bg-emerald-100 text-[#10B981]" : "bg-red-100 text-[#EF4444]"}`}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-xs font-semibold text-[#2563EB] border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => updateRole(user._id, user.role === "admin" ? "user" : "admin")}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${user.role === "admin" ? "text-red-500 border-red-200 hover:bg-red-50" : "text-[#10B981] border-emerald-200 hover:bg-emerald-50"}`}
                      >
                        {user.role === "admin" ? "Demote" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-xs font-semibold text-[#EF4444] border border-red-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (This was missing) */}
        <div className="md:hidden space-y-4 mb-6">
          {users.map((user) => (
            <div key={user._id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  user.role === "admin"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {user.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{user.email}</p>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  user.isVerified
                    ? "bg-emerald-100 text-[#10B981]"
                    : "bg-red-100 text-[#EF4444]"
                }`}>
                  {user.isVerified ? "Verified" : "Unverified"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-[10px] font-semibold text-[#2563EB] border border-blue-200 px-2.5 py-1.5 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => updateRole(user._id, user.role === "admin" ? "user" : "admin")}
                    className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border transition ${
                      user.role === "admin"
                        ? "text-red-500 border-red-200"
                        : "text-[#10B981] border-emerald-200"
                    }`}
                  >
                    {user.role === "admin" ? "Demote" : "Admin"}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-[10px] font-semibold text-[#EF4444] border border-red-200 px-2.5 py-1.5 rounded-lg transition"
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">No users found</div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs text-gray-500 font-medium">Page <span className="font-bold text-gray-900">{page}</span> of <span className="font-bold text-gray-900">{totalPages || 1}</span></p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}