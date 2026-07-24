"use client";

import { useShopping } from "@/components/ShoppingProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { formatPricePKR } from "@/lib/utilis";

export default function WishlistPage() {
  const { data: session } = useSession();
  const { wishlistItems, removeFromWishlist, addToCart, isInCart, loading } =
    useShopping();

  <h1 className="text-2xl font-bold text-gray-900 mb-8">
    My Wishlist{" "}
    <span className="text-gray-400 text-lg font-normal">
      ({wishlistItems.length} items)
    </span>
  </h1>;

  {
    !session?.user && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6 text-sm text-yellow-800">
        You are browsing as a guest.{" "}
        <Link
          href="/login"
          className="font-semibold underline hover:text-yellow-900"
        >
          Login
        </Link>{" "}
        to save your wishlist permanently.
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-6xl mb-4">♡</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 mb-6">Save products you love for later</p>
        <Link
          href="/"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          My Wishlist{" "}
          <span className="text-gray-400 text-lg font-normal">
            ({wishlistItems.length} items)
          </span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full bg-gray-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                    📦
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  disabled={loading}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                >
                  ♥
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 line-clamp-1">
                  {item.title}
                </h3>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-indigo-600 font-bold">
                    {formatPricePKR(item.discountPrice || item.price)}
                  </span>
                  {item.discountPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPricePKR(item.price)}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() =>
                      addToCart({
                        _id: item.productId,
                        title: item.title,
                        price: item.price,
                        discountPrice: item.discountPrice,
                        images: [item.image],
                      })
                    }
                    disabled={isInCart(item.productId) || loading}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                      isInCart(item.productId)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {isInCart(item.productId) ? "✓ In Cart" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    disabled={loading}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
