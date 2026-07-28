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
      <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full text-center shadow-sm">

      
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          Thank you for shopping at Haanli Bazaar.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Your order has been confirmed and will be processed shortly.
        </p>

        
        <div className="border-t border-gray-100 my-6"></div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-indigo-700 mb-3">
            What happens next?
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs">1</span>
              </div>
              <p className="text-xs text-gray-600">Your order is being processed</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs">2</span>
              </div>
              <p className="text-xs text-gray-600">You will receive tracking information</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs">3</span>
              </div>
              <p className="text-xs text-gray-600">Delivery within 3-5 working days</p>
            </div>
          </div>
        </div>

      
        <div className="flex flex-col gap-3">
          <Link
            href="/orders"
            className="bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
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