"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
  _id: string;
  user: { name: string; email: string };
  total: number;
  status: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
}

interface SearchResults {
  orders: Order[];
  users: User[];
  products: Product[];
}

export default function AdminSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    orders: [],
    users: [],
    products: [],
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.trim().length < 2) {
      setResults({ orders: [], users: [], products: [] });
      setOpen(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/admin/search?q=${encodeURIComponent(value.trim())}`,
        );
        const data = await res.json();

        if (data.success) {
          setResults(data);
          setOpen(true);
        }
      } catch {
        return;
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const hasResults =
    results.orders.length > 0 ||
    results.users.length > 0 ||
    results.products.length > 0;

  const handleOrderClick = (orderId: string) => {
    setOpen(false);
    setQuery("");
    router.push("/admin/orders");
  };

  const handleUserClick = (userId: string) => {
    setOpen(false);
    setQuery("");
    router.push("/admin/users");
  };

  const handleProductClick = (productId: string) => {
    setOpen(false);
    setQuery("");
    router.push("/admin/products");
  };

  return (
    <div ref={containerRef} className="relative w-96">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          {loading ? (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => hasResults && setOpen(true)}
          placeholder="Search orders, users, products..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
        />
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {!hasResults && !loading && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              No results found for "{query}"
            </div>
          )}

          {results.orders.length > 0 && (
            <div>
              <p className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Orders
              </p>
              {results.orders.map((order) => (
                <button
                  key={order._id}
                  type="button"
                  onClick={() => handleOrderClick(order._id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      #{String(order._id).slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.user?.name || "Guest"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-700">
                      PKR {(order.total * 278).toLocaleString()}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.users.length > 0 && (
            <div>
              <p className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Users
              </p>
              {results.users.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => handleUserClick(user._id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {user.role.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          )}

          {results.products.length > 0 && (
            <div>
              <p className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Products
              </p>
              {results.products.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => handleProductClick(product._id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {product.title}
                  </p>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-700">
                      PKR {(product.price * 278).toLocaleString()}
                    </p>
                    <p
                      className={`text-[10px] font-bold ${
                        product.stock === 0
                          ? "text-red-500"
                          : product.stock <= 5
                          ? "text-amber-500"
                          : "text-green-600"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of stock"
                        : `${product.stock} in stock`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}