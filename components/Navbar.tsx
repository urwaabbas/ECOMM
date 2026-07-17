"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-black tracking-tight text-indigo-600 hover:opacity-90 transition"
            >
              HANLI<span className="text-gray-900">BAZAR</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
              >
                Home
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
              >
                Shop All
              </Link>
            </div>
          </div>

          {/* Desktop Right side CTA */}
          <div className="hidden md:flex items-center gap-6">
            {status === "authenticated" ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                >
                  Profile
                </Link>
                <div className="h-4 w-[1px] bg-gray-200"></div>
                <span className="text-sm font-medium text-gray-700">
                  Hi,{" "}
                  <span className="font-semibold text-gray-900">
                    {session?.user?.name}
                  </span>
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-50"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Down */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 py-4 px-6 space-y-3 shadow-inner">
          <Link
            href="/"
            className="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-1"
          >
            Home
          </Link>
          <Link
            href="#"
            className="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-1"
          >
            Shop All
          </Link>
          <div className="h-[1px] bg-gray-100 my-2"></div>
          {status === "authenticated" ? (
            <div className="space-y-3">
              <Link
                href="/profile"
                className="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-1"
              >
                Profile
              </Link>
              <div className="text-sm text-gray-500">
                Signed in as:{" "}
                <span className="font-semibold text-gray-900">
                  {session?.user?.name}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-center bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                className="w-full text-center text-sm font-medium text-gray-700 hover:text-indigo-600 py-2 border border-gray-200 rounded-lg"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-full text-center bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm"
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
