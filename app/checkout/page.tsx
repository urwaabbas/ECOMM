"use client";

import { useShopping } from "@/components/ShoppingProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { formatPricePKR } from "@/lib/utilis";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { cartItems } = useShopping();
  const [loading, setLoading] = useState(false);

  // Calculate total price
  const total = cartItems.reduce((sum, item) => {
    return sum + (item.discountPrice || item.price) * item.quantity;
  }, 0);

  // Call API and redirect to Stripe
  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">Please login to checkout</p>
        <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
          Login
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link href="/products" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.title} x {item.quantity}
                </span>
                <span className="text-gray-900 font-medium">
                  {formatPricePKR((item.discountPrice || item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-indigo-600">
              {formatPricePKR(total)}
            </span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Redirecting to payment..." : "Pay Now"}
        </button>

        <Link
          href="/cart"
          className="block text-center text-sm text-gray-500 mt-4 hover:text-indigo-600 transition"
        >
          Back to Cart
        </Link>

      </div>
    </div>
  );
}