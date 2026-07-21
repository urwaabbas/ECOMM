"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";

export interface ProductSummary {
  _id: string;
  title: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  images?: string[];
  stock: number;
  category?: {
    name?: string;
    slug?: string;
  };
}

export interface CartItem extends ProductSummary {
  quantity: number;
  image: string;
}

export interface WishlistItem extends ProductSummary {
  image: string;
}

interface ShoppingContextValue {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  cartCount: number;
  wishlistCount: number;
  cartSubtotal: number;
  addToCart: (product: ProductSummary, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addToWishlist: (product: ProductSummary) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (product: ProductSummary) => void;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
}

const ShoppingContext = createContext<ShoppingContextValue | undefined>(
  undefined,
);

export default function ShoppingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadShoppingData = async () => {
    if (!session?.user?.email) {
      setCartItems([]);
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);
      const [cartResponse, wishlistResponse] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/wishlist"),
      ]);

      const cartData = await cartResponse.json();
      const wishlistData = await wishlistResponse.json();

      const normalizedCart = (cartData?.cart?.items || []).map((item: any) => ({
        _id: item.productId,
        title: item.title,
        description: "",
        price: Number(item.price ?? 0),
        discountPrice: item.discountPrice ?? null,
        images: item.image ? [item.image] : [],
        stock: 999,
        quantity: Number(item.quantity ?? 1),
        image: item.image ?? "",
        category: { name: "Product", slug: "product" },
      }));

      const normalizedWishlist = (wishlistData?.wishlist?.items || []).map(
        (item: any) => ({
          _id: item.productId,
          title: item.title,
          description: "",
          price: Number(item.price ?? 0),
          discountPrice: item.discountPrice ?? null,
          images: item.image ? [item.image] : [],
          stock: 999,
          image: item.image ?? "",
          category: { name: "Product", slug: "product" },
        }),
      );

      setCartItems(normalizedCart);
      setWishlistItems(normalizedWishlist);
    } catch (error) {
      console.error("Failed to load shopping data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShoppingData();
  }, [session?.user?.email]);

  const addToCart = async (product: ProductSummary, quantity = 1) => {
    if (!session?.user?.email) {
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      const data = await response.json();
      if (data.success) {
        await loadShoppingData();
      }
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!session?.user?.email) {
      return;
    }

    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        await loadShoppingData();
      }
    } catch (error) {
      console.error("Failed to remove from cart", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session?.user?.email) {
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json();
      if (data.success) {
        await loadShoppingData();
      }
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const addToWishlist = async (product: ProductSummary) => {
    if (!session?.user?.email) {
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await response.json();
      if (data.success) {
        await loadShoppingData();
      }
    } catch (error) {
      console.error("Failed to add to wishlist", error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!session?.user?.email) {
      return;
    }

    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        await loadShoppingData();
      }
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };

  const moveToCart = async (product: ProductSummary) => {
    await addToCart(product, 1);
    await removeFromWishlist(product._id);
  };

  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);
  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item._id === productId);

  const clearCart = async () => {
    if (!session?.user?.email) {
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      });
      const data = await response.json();
      if (data.success) {
        await loadShoppingData();
      }
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  };

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const wishlistCount = wishlistItems.length;

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + (item.discountPrice ?? item.price) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const value = useMemo<ShoppingContextValue>(
    () => ({
      cartItems,
      wishlistItems,
      cartCount,
      wishlistCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      addToWishlist,
      removeFromWishlist,
      moveToCart,
      isInCart,
      isInWishlist,
      clearCart,
    }),
    [cartItems, wishlistItems, cartCount, wishlistCount, cartSubtotal],
  );

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error("useShopping must be used within a ShoppingProvider");
  }
  return context;
}
