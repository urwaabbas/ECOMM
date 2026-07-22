"use client";

import Link from "next/link";
import { useShopping } from "@/components/ShoppingProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  stock: number;
  category?: any;
}

interface ShoppingActionsProps {
  product?: Product;
}

export default function ShoppingActions({ product }: ShoppingActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    cartCount,
    wishlistCount,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInCart,
    isInWishlist,
    loading,
  } = useShopping();

  // ─── NAVBAR MODE: no product prop passed ───────────────────────
  if (!product) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/wishlist"
          className="relative text-gray-600 hover:text-indigo-600 transition"
        >
          <span className="text-xl">♡</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {wishlistCount > 9 ? "9+" : wishlistCount}
            </span>
          )}
        </Link>

        <Link
          href="/cart"
          className="relative text-gray-600 hover:text-indigo-600 transition"
        >
          <span className="text-xl">🛒</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </Link>
      </div>
    );
  }

  // ─── PRODUCT DETAIL MODE: product prop passed ──────────────────
  const handleAddToCart = () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    addToCart(product);
  };

  const handleWishlistToggle = () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const inCart = isInCart(product._id);
  const inWishlist = isInWishlist(product._id);
  const outOfStock = product.stock === 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={outOfStock || inCart || loading}
        className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition ${
          outOfStock
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : inCart
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {outOfStock ? "Out of Stock" : inCart ? "✓ Added to Cart" : "Add to Cart"}
      </button>

      {/* Wishlist Toggle Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider border transition ${
          inWishlist
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        {inWishlist ? "♥ Remove from Wishlist" : "♡ Add to Wishlist"}
      </button>

      {/* Login prompt if not signed in */}
      {!session?.user && (
        <p className="text-xs text-center text-gray-400">
          <Link href="/login" className="text-indigo-600 hover:underline font-semibold">
            Sign in
          </Link>{" "}
          to save items to your cart and wishlist
        </p>
      )}
    </div>
  );
}