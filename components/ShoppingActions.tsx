"use client";

import React from "react";
import { useShopping } from "@/components/ShoppingProvider";
import { formatPricePKR } from "@/lib/utilis";

interface ShoppingActionsProps {
  product: {
    _id: string;
    title: string;
    description?: string;
    price: number;
    discountPrice?: number | null;
    images?: string[];
    stock: number;
    category?: { name?: string; slug?: string };
  };
}

export default function ShoppingActions({ product }: ShoppingActionsProps) {
  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInCart,
    isInWishlist,
    cartCount,
    wishlistCount,
  } = useShopping();

  return (
    <div className="space-y-3">
      <button
        onClick={() => addToCart(product)}
        disabled={product.stock === 0 || isInCart(product._id)}
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
      >
        {product.stock === 0
          ? "Out of Stock"
          : isInCart(product._id)
            ? "Added to Cart"
            : "Add to Shopping Cart"}
      </button>
      <button
        onClick={() =>
          isInWishlist(product._id)
            ? removeFromWishlist(product._id)
            : addToWishlist(product)
        }
        className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition ${
          isInWishlist(product._id)
            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
            : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
        }`}
      >
        {isInWishlist(product._id)
          ? "♥ Saved to Wishlist"
          : "♡ Add to Wishlist"}
      </button>
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Cart items</span>
          <span className="font-semibold text-gray-900">{cartCount}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span>Wishlist items</span>
          <span className="font-semibold text-gray-900">{wishlistCount}</span>
        </div>
        <div className="mt-3 rounded-xl bg-white p-3 text-xs text-gray-500">
          Estimated total:{" "}
          <span className="font-semibold text-gray-900">
            {formatPricePKR(product.discountPrice ?? product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
