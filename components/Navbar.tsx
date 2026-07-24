"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useShopping } from "@/components/ShoppingProvider";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount, wishlistCount } = useShopping();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-indigo-600">
          Haanli Bazaar
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            Products
          </Link>

          <Link
            href="/wishlist"
            className="text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
          </Link>

          <Link
            href="/cart"
            className="text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>

          <Link
            href="/orders"
            className="text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            Orders
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Hi, {session.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-red-500 hover:text-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
