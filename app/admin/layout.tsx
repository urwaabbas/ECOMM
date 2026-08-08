"use client";

import Providers from "@/components/Providers";
import ShoppingProvider from "@/components/ShoppingProvider";
import AdminSidebar from "@/components/AdminSidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Helper function to check if a link is currently active
  const isActive = (path: string) => pathname === path;

  return (
    <Providers>
      <ShoppingProvider>
        {isLoginPage ? (
          <>{children}</>
        ) : (
          /* Added pb-16 (padding-bottom) so the bottom mobile nav doesn't cover up your page content */
          <div className="flex min-h-screen bg-gray-50 pb-16 md:pb-0">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
              <AdminSidebar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto w-full">{children}</main>

            {/* Mobile Bottom Navigation Bar (Hidden on Desktop, Visible on Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
              <Link
                href="/admin"
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${isActive("/admin") ? "text-[#2563EB]" : "text-gray-400 hover:text-gray-900"}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="text-[10px] font-bold tracking-wide">
                  Dash
                </span>
              </Link>

              <Link
                href="/admin/products"
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${isActive("/admin/products") ? "text-[#2563EB]" : "text-gray-400 hover:text-gray-900"}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span className="text-[10px] font-bold tracking-wide">
                  Products
                </span>
              </Link>

              <Link
                href="/admin/orders"
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${isActive("/admin/orders") ? "text-[#2563EB]" : "text-gray-400 hover:text-gray-900"}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-[10px] font-bold tracking-wide">
                  Orders
                </span>
              </Link>

              <Link
                href="/admin/users"
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${isActive("/admin/users") ? "text-[#2563EB]" : "text-gray-400 hover:text-gray-900"}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-[10px] font-bold tracking-wide">
                  Users
                </span>
              </Link>

              <Link
                href="/admin/chat"
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${isActive("/admin/chat") ? "text-[#2563EB]" : "text-gray-400 hover:text-gray-900"}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span className="text-[10px] font-bold tracking-wide">
                  Chat
                </span>
              </Link>
              <Link
                href="/admin/newsletter"
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${isActive("/admin/newsletter") ? "text-[#2563EB]" : "text-gray-400 hover:text-gray-900"}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[10px] font-bold tracking-wide">
                  Newsletter
                </span>
              </Link>
            </div>
          </div>
        )}
      </ShoppingProvider>
    </Providers>
  );
}
