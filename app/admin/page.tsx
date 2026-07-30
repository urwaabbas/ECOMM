"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
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

      const fetchStats = async () => {
        try {
          const res = await fetch("/api/admin/stats");
          const data = await res.json();
          if (data.success) setStats(data.stats);
        } catch (err) {
          console.error("Failed to fetch stats:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {session?.user?.name}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats?.totalUsers}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats?.totalProducts}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats?.totalOrders}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">
              PKR {((stats?.totalRevenue || 0) * 278).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/users"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-indigo-300 hover:bg-indigo-50 transition"
          >
            <h3 className="font-semibold text-gray-900 mb-1">User Management</h3>
            <p className="text-sm text-gray-500">View all registered users</p>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-indigo-300 hover:bg-indigo-50 transition"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Order Management</h3>
            <p className="text-sm text-gray-500">View and update all orders</p>
          </Link>
          <Link
            href="/admin/products"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-indigo-300 hover:bg-indigo-50 transition"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Product Management</h3>
            <p className="text-sm text-gray-500">Manage store products</p>
          </Link>
        </div>

      </div>
    </div>
  );
}