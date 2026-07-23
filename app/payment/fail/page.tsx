"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full text-center">

        <div className="text-5xl mb-4">❌</div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Your payment was cancelled. Your cart items are still saved.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/cart"
            className="bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Back to Cart
          </Link>
          <Link
            href="/products"
            className="text-sm text-gray-500 hover:text-indigo-600 transition"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}