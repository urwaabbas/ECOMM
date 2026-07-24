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

// localStorage helpers
const getLocalCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("guest_cart") || "[]");
  } catch { return []; }
};

const saveLocalCart = (items: CartItem[]) => {
  localStorage.setItem("guest_cart", JSON.stringify(items));
};

const getLocalWishlist = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("guest_wishlist") || "[]");
  } catch { return []; }
};

const saveLocalWishlist = (items: WishlistItem[]) => {
  localStorage.setItem("guest_wishlist", JSON.stringify(items));
};

export default function ShoppingProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!session?.user;

  // Fetch cart from API (logged in users)
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

  // Fetch wishlist from API (logged in users)
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

  // When session changes (login/logout)
  useEffect(() => {
    if (session?.user) {
      // User just logged in → merge localStorage with DB
      const localCart = getLocalCart();
      const localWishlist = getLocalWishlist();

      // If guest had items → sync them to DB
      if (localCart.length > 0) {
        localCart.forEach(async (item) => {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
        });
        localStorage.removeItem("guest_cart");
      }

      if (localWishlist.length > 0) {
        localWishlist.forEach(async (item) => {
          await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
        });
        localStorage.removeItem("guest_wishlist");
      }

      refreshCart();
      refreshWishlist();
    } else {
      // Not logged in → load from localStorage
      setCartItems(getLocalCart());
      setWishlistItems(getLocalWishlist());
    }
  }, [session, refreshCart, refreshWishlist]);

  // Add to cart
  const addToCart = async (product: any) => {
    if (!isLoggedIn) {
      // Guest → save to localStorage
      const current = getLocalCart();
      const exists = current.find(i => i.productId === product._id);
      let updated;
      if (exists) {
        updated = current.map(i =>
          i.productId === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        updated = [...current, {
          productId: product._id,
          title: product.title,
          price: product.price,
          discountPrice: product.discountPrice || null,
          image: product.images?.[0] || "",
          quantity: 1,
        }];
      }
      saveLocalCart(updated);
      setCartItems(updated);
      return;
    }

    // Logged in → save to DB
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

  // Remove from cart
  const removeFromCart = async (productId: string) => {
    if (!isLoggedIn) {
      const updated = getLocalCart().filter(i => i.productId !== productId);
      saveLocalCart(updated);
      setCartItems(updated);
      return;
    }
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

  // Update quantity
  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!isLoggedIn) {
      const updated = getLocalCart().map(i =>
        i.productId === productId ? { ...i, quantity } : i
      );
      saveLocalCart(updated);
      setCartItems(updated);
      return;
    }
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

  // Add to wishlist
  const addToWishlist = async (product: any) => {
    if (!isLoggedIn) {
      const current = getLocalWishlist();
      const exists = current.find(i => i.productId === product._id);
      if (!exists) {
        const updated = [...current, {
          productId: product._id,
          title: product.title,
          price: product.price,
          discountPrice: product.discountPrice || null,
          image: product.images?.[0] || "",
        }];
        saveLocalWishlist(updated);
        setWishlistItems(updated);
      }
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id?.toString() || "",
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

  // Remove from wishlist
  const removeFromWishlist = async (productId: string) => {
    if (!isLoggedIn) {
      const updated = getLocalWishlist().filter(i => i.productId !== productId);
      saveLocalWishlist(updated);
      setWishlistItems(updated);
      return;
    }
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

  // Clear cart
  const clearCart = async () => {
    if (!isLoggedIn) {
      localStorage.removeItem("guest_cart");
      setCartItems([]);
      return;
    }
    setCartItems([]);
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
    cartItems.some(item => item.productId === productId);

  const isInWishlist = (productId: string) =>
    wishlistItems.some(item => item.productId === productId);

  return (
    <ShoppingContext.Provider value={{
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
    }}>
      {children}
    </ShoppingContext.Provider>
  );
}