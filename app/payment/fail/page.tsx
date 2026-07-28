"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full text-center shadow-sm">

      
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Your payment was cancelled. Don't worry — your cart items are still saved.
        </p>

        
        <div className="border-t border-gray-100 my-6"></div>

  
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-red-700 mb-3">
            What might have gone wrong?
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-red-400 text-xs mt-0.5">•</span>
              <p className="text-xs text-gray-600">Payment was declined by your bank</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 text-xs mt-0.5">•</span>
              <p className="text-xs text-gray-600">You cancelled the payment manually</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 text-xs mt-0.5">•</span>
              <p className="text-xs text-gray-600">Session timed out during payment</p>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col gap-3">
          <Link
            href="/cart"
            className="bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Try Again
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