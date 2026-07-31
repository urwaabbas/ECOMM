"use client";

import Providers from "@/components/Providers";
import ShoppingProvider from "@/components/ShoppingProvider";
import AdminSidebar from "@/components/AdminSidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <Providers>
      <ShoppingProvider>
        {isLoginPage ? (
          <>{children}</>
        ) : (
          <div className="flex min-h-screen bg-gray-100">
            <div className="hidden md:block">
              <AdminSidebar />
            </div>
            <main className="flex-1 overflow-auto w-full">
              {children}
            </main>
          </div>
        )}
      </ShoppingProvider>
    </Providers>
  );
}