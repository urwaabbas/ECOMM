"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: { title: string; quantity: number }[];
  total: number;
  status: string;
  createdAt: string;
}

const statusStyle: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-indigo-100 text-indigo-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
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

      const fetchOrders = async () => {
        try {
          const res = await fetch("/api/admin/orders");
          const data = await res.json();
          if (data.success) setOrders(data.orders);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [session, status, router]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {["pending", "paid", "processing", "completed", "cancelled"].map((s) => (
            <div
              key={s}
              className={`rounded-xl px-4 py-3 text-center ${statusStyle[s]}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide">{s}</p>
              <p className="text-2xl font-bold mt-1">
                {orders.filter((o) => o.status === s).length}
              </p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1.2fr_2fr_1fr_1.2fr] bg-gray-100 border-b border-gray-200 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {orders.map((order, i) => (
              <div
                key={order._id}
                className={`grid grid-cols-[1fr_1.2fr_2fr_1fr_1.2fr] px-6 py-4 items-center gap-2 hover:bg-gray-50 transition ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                {/* Order ID */}
                <div>
                  <p className="text-xs font-mono font-semibold text-gray-700">
                    #{order._id.substring(0, 10).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Customer */}
                <div>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {order.user?.name || "Unknown"}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {order.user?.email}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {order.items.map((i) => `${i.title} x${i.quantity}`).join(", ")}
                  </p>
                </div>

                {/* Total */}
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    PKR {(order.total * 278).toLocaleString()}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer ${statusStyle[order.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}