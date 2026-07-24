"use client";

import { useShopping } from "@/components/ShoppingProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { formatPricePKR } from "@/lib/utilis";

export default function CartPage() {
  const { data: session } = useSession();
  const { cartItems, removeFromCart, updateCartQuantity, clearCart, loading } =
    useShopping();

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.discountPrice || item.price) * item.quantity;
  }, 0);



  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link
          href="/"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-center"
              >
                
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                      📦
                    </div>
                  )}
                </div>

                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {item.title}
                  </h3>
                  <p className="text-indigo-600 font-bold mt-1">
                    {formatPricePKR(item.discountPrice || item.price)}
                  </p>
                </div>

                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      updateCartQuantity(item.productId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1 || loading}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartQuantity(item.productId, item.quantity + 1)
                    }
                    disabled={loading}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">
                    {formatPricePKR(
                      (item.discountPrice || item.price) * item.quantity,
                    )}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    disabled={loading}
                    className="text-xs text-red-500 hover:text-red-700 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              disabled={loading}
              className="text-sm text-gray-500 hover:text-red-600 underline"
            >
              Clear entire cart
            </button>
          </div>

          
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>
                    Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)}{" "}
                    items)
                  </span>
                  <span className="font-semibold">
                    {formatPricePKR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>{formatPricePKR(subtotal)}</span>
                </div>
              </div>
              {session?.user ? (
                <Link
                  href="/checkout"
                  className="mt-6 block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="mt-6 block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Login to Checkout
                </Link>
              )}
              ;
              <Link
                href="/"
                className="mt-3 block w-full text-center text-sm text-gray-500 hover:text-indigo-600"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
