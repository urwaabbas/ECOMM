"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: { title: string; quantity: number }[];
  total: number;
  status: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface Product {
  _id: string;
  title: string;
  stock: number;
  price: number;
  images: string[];
  category: { name: string };
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: { name: string; value: number }[];
  productsByCategory: { name: string; count: number }[];
}


const PIE_COLORS = ["#f59e0b", "#10b981", "#2563eb", "#6366f1", "#ef4444"];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
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
      fetchAll();
    }
  }, [session, status, router]);

  const fetchAll = async () => {
    try {
      const [statsRes, ordersRes, usersRes, productsRes] =
        await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/users"),
          fetch("/api/admin/products"),
        ]);

      const [statsData, ordersData, usersData, productsData] =
        await Promise.all([
          statsRes.json(),
          ordersRes.json(),
          usersRes.json(),
          productsRes.json(),
        ]);

      if (statsData.success) setStats(statsData.stats);
      if (ordersData.success) setRecentOrders(ordersData.orders.slice(0, 5));
      if (usersData.success) setRecentUsers(usersData.users.slice(0, 5));

      if (productsData.success) {
        const low = productsData.products
          .filter((p: Product) => p.stock <= 5)
          .slice(0, 5);
        setLowStockProducts(low);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusStyle: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    paid: "bg-green-100 text-green-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-indigo-100 text-indigo-700",
    cancelled: "bg-red-100 text-red-600",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3 w-96">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search products, orders, users..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          <AdminNotificationBell />

          <button className="relative w-9 h-9 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>

          <div className="h-6 w-[1px] bg-gray-200"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="w-9 h-9 bg-[#2563EB]/10 text-[#2563EB] font-bold rounded-full flex items-center justify-center text-sm border border-[#2563EB]/20">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-none">{session?.user?.name || "Admin"}</p>
              <p className="text-xs text-gray-500 mt-1">Store Administrator</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-8 max-w-[1600px] w-full mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back, <span className="font-semibold text-gray-700">{session?.user?.name}</span>. Here is what's happening with Haanli Bazaar today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="bg-[#2563EB] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 shadow-xs transition flex items-center gap-2"
            >
              <span>+ Add Product</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-gray-300 transition group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
              <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center group-hover:scale-105 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-gray-900 tracking-tight">{stats?.totalUsers || 0}</p>
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +8.4%
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-gray-300 transition group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Products</p>
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-gray-900 tracking-tight">{stats?.totalProducts || 0}</p>
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +5.2%
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-gray-300 transition group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-gray-900 tracking-tight">{stats?.totalOrders || 0}</p>
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +12.1%
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-gray-300 transition group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
              <div className="w-10 h-10 bg-emerald-50 text-[#10B981] rounded-xl flex items-center justify-center group-hover:scale-105 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-black text-[#10B981] tracking-tight">
                PKR {((stats?.totalRevenue || 0) * 278).toLocaleString()}
              </p>
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +15.3%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Orders by Status</h2>
              <span className="text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">Real-time</span>
            </div>
            {stats?.ordersByStatus && stats.ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.ordersByStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0_0 / 0.1)" }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                No order status data available
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Products by Category</h2>
              <span className="text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">Inventory</span>
            </div>
            {stats?.productsByCategory && stats.productsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.productsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
                  <Tooltip contentStyle={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0_0 / 0.1)" }} cursor={{ fill: "rgba(37, 99, 235, 0.04)" }} />
                  <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                No product category data available
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
                View All &rarr;
              </Link>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5">
                        <p className="font-semibold text-gray-900">{order.user?.name || "Guest"}</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="py-3.5 text-gray-600 text-xs">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </td>
                      <td className="py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle[order.status] || "bg-gray-100 text-gray-700"}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-semibold text-gray-900">
                        PKR {(order.total * 278).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-400 text-sm">No recent orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Low Stock Alerts</h2>
              <Link href="/admin/products" className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
                View All &rarr;
              </Link>
            </div>
            <div className="space-y-4 flex-1">
              {lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-gray-50 transition border border-gray-100">
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{product.title}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${product.stock === 0 ? "text-[#EF4444]" : "text-amber-500"}`}>
                      {product.stock === 0 ? "Out of Stock" : `${product.stock} units left`}
                    </p>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="h-40 flex items-center justify-center text-gray-400 text-sm text-center">
                  All store products are well-stocked!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Recent Users</h2>
            <Link href="/admin/users" className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
              View All Users &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600 border border-gray-200">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </td>
                    <td className="py-3.5 text-gray-500 text-xs">{user.email}</td>
                    <td className="py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.isVerified ? "bg-emerald-100 text-[#10B981]" : "bg-red-100 text-[#EF4444]"}`}>
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400 text-sm">No recent users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs mb-8">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="bg-[#2563EB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-xs"
            >
              + Add Product
            </Link>
            <Link
              href="/admin/orders"
              className="bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition shadow-xs"
            >
              View Orders
            </Link>
            <Link
              href="/admin/users"
              className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition shadow-xs"
            >
              Manage Users
            </Link>
            <Link
              href="/"
              className="border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              View Storefront
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}