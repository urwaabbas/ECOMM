import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import ShoppingProvider from "@/components/ShoppingProvider";
import Footer from "@/components/Footer";
export const metadata: Metadata = {
  title: "E-Commerce Platform",
  description: "Next.js 5 Relational Product Checkout Framework",
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
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ShoppingProvider>
        </Providers>
      </body>
    </html>
  );
}
