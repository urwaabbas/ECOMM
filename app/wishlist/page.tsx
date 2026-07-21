"use client";

import Link from "next/link";
import { useShopping } from "@/components/ShoppingProvider";
import { formatPricePKR } from "@/lib/utilis";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, moveToCart } = useShopping();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
              Wishlist
            </p>
            <h1 className="mt-2 text-3xl font-black text-gray-900">
              Saved for later
            </h1>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Discover products
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Tap the heart on any product to save it here.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="h-48 rounded-2xl bg-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : null}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.category?.name || "Product"}
                  </p>
                  <p className="mt-3 font-semibold text-gray-900">
                    {formatPricePKR(item.discountPrice ?? item.price)}
                  </p>
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => moveToCart(item)}
                    className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
