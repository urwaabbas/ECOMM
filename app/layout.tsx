import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import ShoppingProvider from "@/components/ShoppingProvider";
import ConditionalLayout from "@/components/ConditionalLayout";
import NotificationProvider from "@/components/NotificationProvider";

export const metadata: Metadata = {
  title: "HAANLI BAZAAR",
  description: "Shopping Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50 antialiased">
      <body className="flex h-full flex-col font-sans text-gray-900">
        <Providers>
          <ShoppingProvider>
            <NotificationProvider />
            <ConditionalLayout>{children}</ConditionalLayout>
          </ShoppingProvider>
        </Providers>
      </body>
    </html>
  );
}