"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

function AdminOrdersPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const highlightRef = useRef<HTMLDivElement>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/");
        return;
      }

      const fetchOrders = async () => {
        try {
          const response = await fetch("/api/admin/orders");
          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error || "Failed to fetch orders");
          }

          setOrders(data.orders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!highlightId || orders.length === 0) return;

    const timer = setTimeout(() => {
      if (highlightRef.current) {
        highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [highlightId, orders]);

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const shortId = order._id.slice(-6).toUpperCase();
    const fullId = order._id.toUpperCase();
    const name = (order.user?.name || "").toLowerCase();
    const email = (order.user?.email || "").toLowerCase();
    return (
      shortId.includes(q.toUpperCase()) ||
      fullId.includes(q.toUpperCase()) ||
      name.includes(q) ||
      email.includes(q)
    );
  });

  const updateStatus = async (orderId: string, newStatus: string) => {
    const currentOrder = orders.find((order) => order._id === orderId);

    if (!currentOrder || currentOrder.status === newStatus) {
      return;
    }

    try {
      setUpdatingOrderId(orderId);

      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update status");
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: data.order.status }
            : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Order status could not be updated.",
      );
    } finally {
      setUpdatingOrderId(null);
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {["pending", "paid", "processing", "completed", "cancelled"].map(
            (orderStatus) => (
              <div
                key={orderStatus}
                className={`rounded-xl px-4 py-3 text-center ${statusStyle[orderStatus]}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide">
                  {orderStatus}
                </p>
                <p className="text-2xl font-bold mt-1">
                  {orders.filter((order) => order.status === orderStatus).length}
                </p>
              </div>
            ),
          )}
        </div>

        <div className="mb-4 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer name or email..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          />
        </div>

        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-[1fr_1.2fr_2fr_1fr_1.2fr] bg-gray-100 border-b border-gray-200 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredOrders.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">
                No orders match your search
              </div>
            )}
            {filteredOrders.map((order, index) => (
              <div
                key={order._id}
                ref={highlightId === order._id ? highlightRef : null}
                className={`grid grid-cols-[1fr_1.2fr_2fr_1fr_1.2fr] px-6 py-4 items-center gap-2 hover:bg-gray-50 transition ${
                  highlightId === order._id
                    ? "bg-indigo-50 border-l-4 border-indigo-500"
                    : index % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50/50"
                }`}
              >
                <div>
                  <p className="text-xs font-mono font-semibold text-gray-700">
                    #{order._id.substring(0, 10).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {order.user?.name || "Guest User"}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {order.user?.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {order.items
                      .map((item) => `${item.title} x${item.quantity}`)
                      .join(", ")}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    PKR {(order.total * 278).toLocaleString()}
                  </p>
                </div>

                <div>
                  <select
                    value={order.status}
                    disabled={updatingOrderId === order._id}
                    onChange={(event) =>
                      updateStatus(order._id, event.target.value)
                    }
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer disabled:opacity-50 ${statusStyle[order.status]}`}
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

        <div className="md:hidden space-y-4">
          {filteredOrders.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">
              No orders match your search
            </div>
          )}
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              ref={highlightId === order._id ? highlightRef : null}
              className={`rounded-xl border p-4 ${
                highlightId === order._id
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-mono font-bold text-gray-700">
                    #{order._id.substring(0, 10).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <select
                  value={order.status}
                  disabled={updatingOrderId === order._id}
                  onChange={(event) =>
                    updateStatus(order._id, event.target.value)
                  }
                  className={`text-xs font-semibold px-2 py-1 rounded-lg focus:outline-none disabled:opacity-50 ${statusStyle[order.status]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <p className="text-sm font-semibold text-gray-800">
                {order.user?.name || "Guest User"}
              </p>
              <p className="text-xs text-gray-400 mb-2">{order.user?.email}</p>
              <p className="text-xs text-gray-600 mb-3">
                {order.items
                  .map((item) => `${item.title} x${item.quantity}`)
                  .join(", ")}
              </p>
              <p className="text-sm font-bold text-indigo-600">
                PKR {(order.total * 278).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense>
      <AdminOrdersPageContent />
    </Suspense>
  );
}