"use client";

import Link from "next/link";
import {
  signOut,
  useSession,
} from "next-auth/react";
import { useShopping } from "@/components/ShoppingProvider";
import { useState } from "react";
import UserNotificationBell from "@/components/UserNotificationBell";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount, wishlistCount } = useShopping();
  const [menuOpen, setMenuOpen] = useState(false);

  const getInitials = (name?: string | null) => {
    if (!name) {
      return "U";
    }

    const parts = name.trim().split(" ");

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold text-indigo-600"
        >
          Haanli Bazaar
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/products"
            className="text-sm text-gray-600 transition hover:text-indigo-600"
          >
            Products
          </Link>

          <Link
            href="/wishlist"
            className="text-sm text-gray-600 transition hover:text-indigo-600"
          >
            Wishlist{" "}
            {wishlistCount > 0 &&
              `(${wishlistCount})`}
          </Link>

          <Link
            href="/cart"
            className="text-sm text-gray-600 transition hover:text-indigo-600"
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>

          <Link
            href="/orders"
            className="text-sm text-gray-600 transition hover:text-indigo-600"
          >
            Orders
          </Link>

          <Link
            href="/contact"
            className="text-sm text-gray-600 transition hover:text-indigo-600"
          >
            Contact
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-4">
              <UserNotificationBell />

              <Link
                href="/profile"
                className="group flex items-center gap-2"
                title="Go to Profile"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white transition group-hover:bg-indigo-700">
                  {getInitials(session.user.name)}
                </div>
              </Link>

              <button
                type="button"
                onClick={() => signOut()}
                className="text-sm text-red-500 transition hover:text-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-gray-600 transition hover:text-indigo-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {session?.user && (
            <UserNotificationBell />
          )}

          <button
            type="button"
            className="text-gray-600 transition hover:text-indigo-600"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="space-y-3 border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-gray-700 transition hover:text-indigo-600"
          >
            Products
          </Link>

          <Link
            href="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-gray-700 transition hover:text-indigo-600"
          >
            Wishlist{" "}
            {wishlistCount > 0 &&
              `(${wishlistCount})`}
          </Link>

          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-gray-700 transition hover:text-indigo-600"
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>

          <Link
            href="/orders"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-gray-700 transition hover:text-indigo-600"
          >
            Orders
          </Link>

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-gray-700 transition hover:text-indigo-600"
          >
            Contact
          </Link>

          {session?.user && (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 transition hover:text-indigo-600"
            >
              Profile
            </Link>
          )}

          {(session?.user as { role?: string } | undefined)
            ?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="border-t border-gray-100 pt-3">
            {session?.user ? (
              <div className="flex items-center justify-between py-2">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {getInitials(
                      session.user.name,
                    )}
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="text-sm text-red-500 transition hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg bg-indigo-600 py-2 text-center text-sm text-white transition hover:bg-indigo-700"
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