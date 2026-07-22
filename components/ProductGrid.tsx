"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useShopping } from "@/components/ShoppingProvider";
import { formatPricePKR } from "@/lib/utilis";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  stock: number;
  isFeatured: boolean;
  ratings: { average: number; count: number };
  category: Category;
}

export default function ProductGrid() {
  const {
    addToCart,
    addToWishlist,
    isInCart,
    isInWishlist,
    removeFromWishlist,
  } = useShopping();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        const uniqueCats = Array.from(
          new Map(
            data.products.map((p: Product) => [p.category._id, p.category]),
          ).values(),
        );
        setCategories(uniqueCats as Category[]);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      const params = new URLSearchParams({
        search: debouncedSearch,
        category: selectedCategory,
        sort,
      });
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
      setLoading(false);
    }
    fetchFilteredProducts();
  }, [debouncedSearch, selectedCategory, sort]);

  // ✅ Normalize product ID to plain string before any shopping action
  const normalizeProduct = (p: Product) => ({
    ...p,
    _id: p._id.toString(),
    images: p.images,
  });

  const pid = (p: Product) => p._id.toString();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Controls */}
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1.8fr_1fr] items-end">
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
              Search Products
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-semibold text-gray-700 mb-2">
              Sort by price
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Categories */}
        <aside className="w-full lg:w-64 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Categories
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Filter products by category for faster browsing.
            </p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
                selectedCategory === ""
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
                  selectedCategory === cat._id
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Categories are loading or unavailable.
            </p>
          )}
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-xl p-4 h-96">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 w-2/3 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">No products found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={pid(p)}
                  className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <Link href={`/products/${pid(p)}`} className="block">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={p.images[0]}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
                          {p.category?.name}
                        </p>
                        <h3 className="font-bold text-gray-800 mt-1">{p.title}</h3>
                        <p className="text-gray-900 font-semibold mt-2">
                          {formatPricePKR(p.discountPrice || p.price)}
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div className="px-4 pb-4 space-y-2">
                    <div className="flex gap-2">
                      {/* ✅ Add to Cart — normalized product */}
                      <button
                        onClick={() => addToCart(normalizeProduct(p))}
                        disabled={p.stock === 0 || isInCart(pid(p))}
                        className={`flex-1 rounded-md px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] transition ${
                          p.stock === 0 || isInCart(pid(p))
                            ? "cursor-not-allowed bg-gray-100 text-gray-400"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {p.stock === 0
                          ? "Out of Stock"
                          : isInCart(pid(p))
                          ? "✓ Added"
                          : "Add to Cart"}
                      </button>

                      {/* ✅ Wishlist toggle — normalized ID */}
                      <button
                        onClick={() =>
                          isInWishlist(pid(p))
                            ? removeFromWishlist(pid(p))
                            : addToWishlist(normalizeProduct(p))
                        }
                        className={`w-11 rounded-md border text-lg transition ${
                          isInWishlist(pid(p))
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {isInWishlist(pid(p)) ? "♥" : "♡"}
                      </button>
                    </div>

                    <Link
                      href={`/products/${pid(p)}`}
                      className="block w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-gray-700 transition hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}