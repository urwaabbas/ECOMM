"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useShopping } from "@/components/ShoppingProvider";

export default function PaymentSuccessPage() {
  const { clearCart } = useShopping();

  useEffect(() => {
    const handleSuccess = async () => {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      });
      await clearCart();
    };
    handleSuccess();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full text-center">

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>

        <p className="text-gray-500 text-sm mb-2">
          Thank you for shopping at Haanli Bazaar.
        </p>

        <p className="text-gray-500 text-sm mb-6">
          Your order has been confirmed and will be processed shortly.
        </p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-indigo-700 mb-2">
            What happens next?
          </p>
          <ul className="text-xs text-indigo-600 space-y-1">
            <li>✓ Your order will be processed within 24 hours</li>
            <li>✓ You will receive tracking information</li>
            <li>✓ Delivery within 3-5 working days</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/orders"
            className="bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-indigo-600 transition"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}