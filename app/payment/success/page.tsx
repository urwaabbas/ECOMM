"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useShopping } from "@/components/ShoppingProvider";

export default function PaymentSuccessPage() {
  const { clearCart } = useShopping();

  // Clear cart when user lands here
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full text-center">
        
        <div className="text-5xl mb-4">✅</div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-gray-500 text-sm mb-6">
          Thank you for your order. We will process it shortly.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/products"
            className="bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-indigo-600 transition"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}