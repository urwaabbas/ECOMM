"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useShopping } from "@/components/ShoppingProvider";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount, wishlistCount } = useShopping();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="text-lg font-bold text-indigo-600">
          Haanli Bazaar
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm text-gray-600 hover:text-indigo-600 transition">
            Products
          </Link>
          <Link href="/wishlist" className="text-sm text-gray-600 hover:text-indigo-600 transition">
            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
          </Link>
          <Link href="/cart" className="text-sm text-gray-600 hover:text-indigo-600 transition">
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          <Link href="/orders" className="text-sm text-gray-600 hover:text-indigo-600 transition">
            Orders
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm text-red-500 hover:text-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600 transition">
                Login
              </Link>
              <Link href="/register" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-gray-600 hover:text-indigo-600 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </div>

      
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 py-2 hover:text-indigo-600 transition"
          >
            Products
          </Link>
          <Link
            href="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 py-2 hover:text-indigo-600 transition"
          >
            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
          </Link>
          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 py-2 hover:text-indigo-600 transition"
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          <Link
            href="/orders"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 py-2 hover:text-indigo-600 transition"
          >
            Orders
          </Link>

          <div className="border-t border-gray-100 pt-3">
            {session?.user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{session.user.name}</span>
                </div>
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="text-sm text-red-500 hover:text-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-sm border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-sm bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </nav>
  );
}