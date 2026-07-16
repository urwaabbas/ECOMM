"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              E-Shop
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 transition">
              Home
            </Link>
            {status === "authenticated" ? (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-indigo-600 transition">
                  Profile
                </Link>
                <span className="text-sm font-medium text-gray-700">
                  Welcome, <span className="text-indigo-600">{session?.user?.name}</span>
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="bg-red-550 hover:bg-red-650 text-white px-4 py-2 rounded-lg text-sm font-semibold transition bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-650 hover:text-indigo-600 font-semibold transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-650 hover:bg-indigo-750 text-white px-4 py-2 rounded-lg text-sm font-semibold transition bg-indigo-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 py-3 space-y-2 px-4">
          <Link href="/" className="block text-gray-600 py-2 hover:text-indigo-600">
            Home
          </Link>
          {status === "authenticated" ? (
            <>
              <Link href="/profile" className="block text-gray-600 py-2 hover:text-indigo-600">
                Profile
              </Link>
              <div className="text-sm font-medium text-gray-700 py-2">
                Logged in as: <span className="font-semibold text-indigo-600">{session?.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 pt-2">
              <Link href="/login" className="block text-center text-gray-650 hover:text-indigo-600 font-semibold py-2">
                Login
              </Link>
              <Link
                href="/register"
                className="block text-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}