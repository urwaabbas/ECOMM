"use client";

import { useShopping } from "@/components/ShoppingProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { formatPricePKR } from "@/lib/utilis";

export default function CartPage() {
  const { data: session } = useSession();

  const {
    cartItems,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    loading,
  } = useShopping();

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.discountPrice || item.price;

    return sum + price * item.quantity;
  }, 0);

  const originalTotal = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const totalSavings = Math.max(
    originalTotal - subtotal,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#f7f7f7] px-4 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center bg-white px-6 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-9 w-9 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M3 3h2l2.4 10.2a2 2 0 002 1.55h7.8a2 2 0 001.95-1.55L21 6H7M10 20a1 1 0 110-2 1 1 0 010 2zm8 0a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-950">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex min-w-52 items-center justify-center bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* PAGE HEADER */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Haanli Bazaar
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
              Shopping Cart
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {totalQuantity}{" "}
              {totalQuantity === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <Link
            href="/products"
            className="text-sm font-semibold text-gray-700 transition hover:text-indigo-600"
          >
            ← Continue Shopping
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* LEFT SIDE — CART ITEMS */}

          <section className="min-w-0">
            {/* CART CONTROL BAR */}

            <div className="mb-4 flex items-center justify-between border border-gray-200 bg-white px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Your Items
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Review quantities before checkout
                </p>
              </div>

              <button
                type="button"
                onClick={clearCart}
                disabled={loading}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.7}
                    d="M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6M9 7V4h6v3m-9 0h12"
                  />
                </svg>

                Clear Cart
              </button>
            </div>

            {/* PRODUCTS */}

            <div className="space-y-3">
              {cartItems.map((item) => {
                const currentPrice =
                  item.discountPrice || item.price;

                const itemTotal =
                  currentPrice * item.quantity;

                const discountPercent =
                  item.discountPrice &&
                  item.discountPrice < item.price
                    ? Math.round(
                        ((item.price -
                          item.discountPrice) /
                          item.price) *
                          100,
                      )
                    : null;

                return (
                  <article
                    key={item.productId}
                    className="border border-gray-200 bg-white p-4 sm:p-5"
                  >
                    <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                      {/* IMAGE */}

                      <Link
                        href={`/products/${item.productId}`}
                        className="relative block h-32 w-full overflow-hidden bg-gray-100 sm:h-32 sm:w-[120px]"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl text-gray-300">
                            📦
                          </div>
                        )}

                        {discountPercent !== null && (
                          <span className="absolute left-2 top-2 bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </Link>

                      {/* PRODUCT CONTENT */}

                      <div className="flex min-w-0 flex-col">
                        <div className="flex flex-col gap-3 md:flex-row md:justify-between">
                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.productId}`}
                            >
                              <h2 className="text-base font-semibold leading-6 text-gray-950 transition hover:text-indigo-600">
                                {item.title}
                              </h2>
                            </Link>

                            <p className="mt-1 text-xs text-gray-500">
                              Sold by Haanli Bazaar
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="text-xl font-bold text-gray-950">
                                {formatPricePKR(
                                  currentPrice,
                                )}
                              </span>

                              {item.discountPrice &&
                                item.discountPrice <
                                  item.price && (
                                  <>
                                    <span className="text-sm text-gray-400 line-through">
                                      {formatPricePKR(
                                        item.price,
                                      )}
                                    </span>

                                    <span className="text-xs font-semibold text-red-600">
                                      -
                                      {
                                        discountPercent
                                      }
                                      %
                                    </span>
                                  </>
                                )}
                            </div>
                          </div>

                          {/* LINE TOTAL */}

                          <div className="md:text-right">
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                              Item Total
                            </p>

                            <p className="mt-1 text-lg font-bold text-gray-950">
                              {formatPricePKR(
                                itemTotal,
                              )}
                            </p>
                          </div>
                        </div>

                        {/* BOTTOM ACTIONS */}

                        <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.productId,
                              )
                            }
                            disabled={loading}
                            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.7}
                                d="M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6M9 7V4h6v3m-9 0h12"
                              />
                            </svg>

                            Remove
                          </button>

                          {/* QUANTITY */}

                          <div className="flex items-center">
                            <span className="mr-3 text-sm text-gray-500">
                              Qty
                            </span>

                            <div className="flex items-center border border-gray-300 bg-white">
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={
                                  item.quantity <= 1 ||
                                  loading
                                }
                                className="flex h-10 w-10 items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>

                              <span className="flex h-10 min-w-11 items-center justify-center border-x border-gray-300 px-3 text-sm font-semibold text-gray-900">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                  )
                                }
                                disabled={loading}
                                className="flex h-10 w-10 items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* RIGHT SIDE — ORDER SUMMARY */}

          <aside className="w-full">
            <div className="border border-gray-200 bg-white p-5 lg:sticky lg:top-28">
              <h2 className="text-xl font-bold text-gray-950">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600">
                    Subtotal ({totalQuantity}{" "}
                    {totalQuantity === 1
                      ? "item"
                      : "items"}
                    )
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatPricePKR(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span className="font-semibold text-emerald-600">
                    Free
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-600">
                      Your Savings
                    </span>

                    <span className="font-semibold text-red-600">
                      -
                      {formatPricePKR(
                        totalSavings,
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-gray-950">
                    Total
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Taxes calculated at checkout
                  </p>
                </div>

                <p className="text-2xl font-bold text-gray-950">
                  {formatPricePKR(subtotal)}
                </p>
              </div>

              {/* CHECKOUT CTA */}

              {session?.user ? (
                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center bg-gray-950 px-5 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-indigo-600"
                >
                  Proceed to Checkout ({totalQuantity})
                </Link>
              ) : (
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(
                    "/checkout",
                  )}`}
                  className="mt-6 flex w-full items-center justify-center bg-gray-950 px-5 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-indigo-600"
                >
                  Login to Checkout
                </Link>
              )}

              <Link
                href="/products"
                className="mt-3 flex w-full items-center justify-center border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-950"
              >
                Continue Shopping
              </Link>

              {/* TRUST INFO */}

              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.7}
                      d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3zm-6 0h12v9H6v-9z"
                    />
                  </svg>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Secure Checkout
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your order and payment information are protected.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.7}
                      d="M9 17h6m-7 4h8a2 2 0 002-2V7l-4-4H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Review Before Payment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Confirm your delivery and payment details on the next step.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}