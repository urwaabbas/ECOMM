"use client";

import Link from "next/link";
import { useShopping } from "@/components/ShoppingProvider";
import { formatPricePKR } from "@/lib/utilis";

export default function CartPage() {
  const { cartItems, cartSubtotal, removeFromCart, updateQuantity, clearCart } =
    useShopping();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
              Shopping Cart
            </p>
            <h1 className="mt-2 text-3xl font-black text-gray-900">
              Your selected items
            </h1>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Continue shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Add a few products to begin your checkout experience.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="h-24 w-full shrink-0 rounded-2xl bg-gray-100 sm:w-24">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.category?.name || "Product"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-sm font-semibold text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="h-8 w-8 rounded-full border border-gray-300 text-lg font-semibold"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="h-8 w-8 rounded-full border border-gray-300 text-lg font-semibold"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatPricePKR(
                          (item.discountPrice ?? item.price) * item.quantity,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Order summary
              </h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPricePKR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatPricePKR(cartSubtotal)}</span>
                </div>
              </div>
              <button className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
              >
                Clear Cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
