"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatPricePKR } from "@/lib/utilis";
import { generateInvoice } from "@/lib/invoice";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentId: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user) fetchOrders();
    else setLoading(false);
  }, [session]);


  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-800">Login to view your orders</h2>
        <Link href="/login" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
          Login
        </Link>
      </div>
    );
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">No orders yet</h2>
        <p className="text-gray-500 text-sm">Start shopping to see your orders here.</p>
        <Link href="/products" className="mt-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">

        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-400 mt-1">
              {orders.length} {orders.length === 1 ? "order" : "orders"} placed
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition"
          >
          Shop More
          </Link>
        </div>

        
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
             
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-50">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                      Order ID
                    </p>
                    <p className="text-xs font-mono font-semibold text-gray-600">
                      #{order._id.substring(0, 12).toUpperCase()}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                      Date
                    </p>
                    <p className="text-xs font-semibold text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

             
                <span className={`self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                  order.status === "paid"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : order.status === "pending"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    order.status === "paid" ? "bg-emerald-500"
                    : order.status === "pending" ? "bg-amber-500"
                    : "bg-blue-500"
                  }`}></span>
                  {order.status.toUpperCase()}
                </span>
              </div>

          
              <div className="px-6 py-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Items Ordered
                </p>
                <div className="space-y-2.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition">
                          {item.quantity}x
                        </span>
                        <span className="text-sm text-gray-700 font-medium">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatPricePKR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    Order Total
                  </p>
                  <p className="text-xl font-black text-indigo-600">
                    {formatPricePKR(order.total)}
                  </p>
                </div>
                <button
                  onClick={() => generateInvoice(order)}
                  className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-sm hover:shadow-indigo-200 hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Receipt
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}