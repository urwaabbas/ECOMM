"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black uppercase tracking-wider text-indigo-600">
          HAANLI BAZAAR
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">
            Products
          </Link>

          {session?.user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-sm font-bold uppercase tracking-wide text-gray-900 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition focus:outline-none"
              >
                {session.user.name} ▾
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                  <button 
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">
                Log In
              </Link>
              <Link href="/register" className="text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}