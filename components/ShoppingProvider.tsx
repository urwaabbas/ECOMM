"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  productId: string;
  title: string;
  price: number;
  discountPrice: number | null;
  quantity: number;
  image: string;
}

interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  discountPrice: number | null;
  image: string;
}

interface ShoppingContextType {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  cartCount: number;
  wishlistCount: number;
  addToCart: (product: any) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  addToWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  loading: boolean;
}

const ShoppingContext = createContext<ShoppingContextType | null>(null);

export function useShopping() {
  const ctx = useContext(ShoppingContext);
  if (!ctx) throw new Error("useShopping must be used within ShoppingProvider");
  return ctx;
}

export default function ShoppingProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) setCartItems(data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  }, [session]);

  const refreshWishlist = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (data.success) setWishlistItems(data.items || []);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      refreshCart();
      refreshWishlist();
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [session, refreshCart, refreshWishlist]);

  const addToCart = async (product: any) => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          title: product.title,
          price: product.price,
          discountPrice: product.discountPrice || null,
          image: product.images?.[0] || "",
          quantity: 1,
        }),
      });
      const data = await res.json();
      if (data.success) setCartItems(data.items || []);
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) setCartItems(data.items || []);
    } catch (err) {
      console.error("Remove from cart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (data.success) setCartItems(data.items || []);
    } catch (err) {
      console.error("Update quantity failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: any) => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  productId: product._id?.toString() || product.id?.toString() || "",
          title: product.title,
          price: product.price,
          discountPrice: product.discountPrice || null,
          image: product.images?.[0] || "",
        }),
      });
      const data = await res.json();
      if (data.success) setWishlistItems(data.items || []);
    } catch (err) {
      console.error("Add to wishlist failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) setWishlistItems(data.items || []);
    } catch (err) {
      console.error("Remove from wishlist failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      });
      const data = await res.json();
      if (data.success) setCartItems([]);
    } catch (err) {
      console.error("Clear cart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const isInCart = (productId: string) =>
    cartItems.some((item) => item.productId === productId);

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item.productId === productId);

  return (
    <ShoppingContext.Provider
      value={{
        cartItems,
        wishlistItems,
        cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        wishlistCount: wishlistItems.length,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToWishlist,
        removeFromWishlist,
        isInCart,
        isInWishlist,
        clearCart,
        refreshCart,
        refreshWishlist,
        loading,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
}