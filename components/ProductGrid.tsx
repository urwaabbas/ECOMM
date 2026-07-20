"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Optimized for performance
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Controls */}
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1.8fr_1fr] items-end">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
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
            <label
              htmlFor="sort"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
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

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                <div>
                  <Link href={`/products/${p._id}`} className="block">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={p.images[0]}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">{p.title}</h3>
                      <p className="text-gray-900 font-semibold mt-2">
                        {formatPricePKR(p.discountPrice || p.price)}
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="px-4 pb-4">
                  <Link
                    href={`/products/${p._id}`}
                    className="block w-full rounded-md bg-indigo-600 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-indigo-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
