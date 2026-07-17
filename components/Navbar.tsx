// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo Anchor */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-black text-gray-900 tracking-tighter uppercase">
              Haanli<span className="text-indigo-600">Bazaar</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-xl transition ${
                    isActive ? "bg-gray-900 text-white" : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Authentication Section */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-20 h-8 bg-gray-50 rounded-xl animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  Hi, {session.user?.name?.split("@")[0]}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-xs font-bold uppercase text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-bold uppercase text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-xl transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-bold uppercase bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-xl transition"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-gray-900 hover:bg-gray-50 p-2 rounded-xl focus:outline-none"
              aria-label="Toggle Menu"
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

      {/* Mobile Menu Panel Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-4 shadow-sm absolute left-0 w-full animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition ${
                    isActive ? "bg-gray-900 text-white" : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Actions Stacked Cleanly */}
          <div className="pt-4 border-t border-gray-100 px-4">
            {status === "loading" ? (
              <div className="h-9 bg-gray-50 rounded-xl animate-pulse w-full" />
            ) : session ? (
              <div className="flex flex-col space-y-3">
                <span className="text-xs font-bold text-gray-500 text-center bg-gray-50 py-2 rounded-xl border border-gray-100">
                  Logged in as: {session.user?.name}
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="w-full text-center text-sm font-bold uppercase text-red-600 bg-red-50/50 hover:bg-red-50 py-2.5 rounded-xl transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-bold uppercase text-gray-900 border border-gray-200 hover:bg-gray-50 py-2.5 rounded-xl transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-bold uppercase bg-indigo-600 text-white hover:bg-indigo-700 py-2.5 rounded-xl transition"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}