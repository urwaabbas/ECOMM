import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import ShoppingProvider from "@/components/ShoppingProvider";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: "Haanli Bazaar",
  description: "Next.js E-Commerce Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50 antialiased">
      <body className="h-full font-sans text-gray-900 flex flex-col">
        <Providers>
          <ShoppingProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ShoppingProvider>
        </Providers>
      </body>
    </html>
  );
}