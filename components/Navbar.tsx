"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useShopping } from "@/components/ShoppingProvider";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount, wishlistCount } = useShopping();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-200 ${scrolled ? "shadow-md border-b border-gray-100" : "border-b border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black uppercase tracking-wider text-indigo-600">
            Haanli Bazaar
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
            Beta
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition">
            Products
          </Link>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Wishlist
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate uppercase tracking-wide text-xs">
                  {session.user.name}
                </span>
                <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{session.user.email}</p>
                  </div>
                  <Link href="/cart" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                    🛒 My Cart {cartCount > 0 && <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-1.5 rounded-full">{cartCount}</span>}
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                    ♡ My Wishlist {wishlistCount > 0 && <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-1.5 rounded-full">{wishlistCount}</span>}
                  </Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">
                Log In
              </Link>
              <Link href="/register" className="text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link href="/products" className="block text-sm font-semibold text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Products</Link>
          <Link href="/wishlist" className="block text-sm font-semibold text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</Link>
          <Link href="/cart" className="block text-sm font-semibold text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
          {session?.user ? (
            <button onClick={() => signOut()} className="block w-full text-left text-sm font-semibold text-red-600 py-2">Sign Out</button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1 text-center text-sm font-semibold border border-gray-200 py-2 rounded-lg" onClick={() => setMobileOpen(false)}>Log In</Link>
              <Link href="/register" className="flex-1 text-center text-sm font-semibold bg-indigo-600 text-white py-2 rounded-lg" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}