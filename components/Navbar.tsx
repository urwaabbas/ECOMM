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

  // Fallback helper to extract a clean string name if session.user.name is undefined
  const getUserDisplayName = () => {
    if (!session?.user) return "";
    const name = session.user.name || session.user.email?.split("@")[0] || "USER";
    return name;
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-black text-gray-900 tracking-tight uppercase">
              Haanli<span className="text-indigo-600">Bazaar</span>
            </Link>
          </div>

          {/* Desktop Links Grid */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold tracking-wide uppercase transition-colors ${
                    isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Authentication Row Layout */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-20 h-8 bg-gray-50 rounded-xl animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-5">
                {/* Removed "Hi", set user profile string to clean bold tracking-wide uppercase text layout */}
                <span className="text-sm font-black text-gray-900 uppercase tracking-wide">
                  {getUserDisplayName()}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-sm font-bold text-red-600 hover:text-red-700 uppercase tracking-wider transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-bold text-gray-700 hover:text-gray-900 uppercase tracking-wider transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-xl uppercase tracking-wider transition shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Actions Button Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-700 hover:bg-gray-50 p-2 rounded-xl focus:outline-none transition"
              aria-label="Toggle Menu Panel"
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

      {/* Floating absolute responsive dropdown panel */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl z-50 md:hidden animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="px-4 pt-3 pb-6 space-y-4">
            
            {/* Nav Links Navigation Block */}
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2.5 text-base font-bold uppercase tracking-wide rounded-xl transition ${
                      isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Border Separation Splitter */}
            <div className="border-t border-gray-100 my-2" />

            {/* Session Action Callouts */}
            <div className="px-3">
              {status === "loading" ? (
                <div className="h-10 bg-gray-50 rounded-xl animate-pulse w-full" />
              ) : session ? (
                <div className="flex flex-col space-y-3">
                  {/* Clean uppercase presentation text string layout matching desktop profile context */}
                  <div className="text-sm font-black text-gray-900 uppercase tracking-wide text-center bg-gray-50 py-2 rounded-xl border border-gray-100">
                    {getUserDisplayName()}
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="w-full text-center text-sm font-bold uppercase tracking-wider text-red-600 bg-red-50/50 hover:bg-red-50 py-3 rounded-xl transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2.5">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm font-bold uppercase tracking-wider text-gray-700 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl transition"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 py-3 rounded-xl transition shadow-xs"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}