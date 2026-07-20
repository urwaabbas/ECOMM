// components/ProductGrid.tsx
"use client";

import React, { useState, useEffect } from "react";
import { getProductImageUrl } from "@/lib/product-image";

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
  ratings: {
    average: number;
    count: number;
  };
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
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (debouncedSearch) queryParams.append("search", debouncedSearch);
        if (selectedCategory) queryParams.append("category", selectedCategory);
        if (sort) queryParams.append("sort", sort);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Error loading items:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilteredProducts();
  }, [debouncedSearch, selectedCategory, sort]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("INR", "Rs.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 pb-6 border-b border-gray-100">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-4 w-full sm:w-auto justify-end">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            Categories
          </h2>
          <div className="flex flex-row lg:flex-col flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-3 py-2 text-left text-sm font-medium rounded-md transition-colors w-auto lg:w-full ${
                selectedCategory === ""
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-3 py-2 text-left text-sm font-medium rounded-md transition-colors w-auto lg:w-full ${
                  selectedCategory === cat._id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white border border-gray-100 rounded-xl p-4 h-96"
                >
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 w-2/3 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">
                No products found matching your active filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => {
                const imageSrc = getProductImageUrl(product);

                return (
                  <div
                    key={product._id}
                    className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                        <img
                          src={imageSrc}
                          alt={product.title}
                          className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                          loading="lazy"
                        />
                        {product.isFeatured && (
                          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
                          {product.category?.name || "Product"}
                        </p>
                        <h3 className="text-sm font-bold text-gray-800 mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[2rem]">
                          {product.description}
                        </p>

                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-xs font-bold text-gray-700">
                            {product.ratings.average}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            ({product.ratings.count})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-gray-50 mt-auto">
                      <div className="flex items-baseline gap-2 mt-3 mb-4">
                        {product.discountPrice ? (
                          <>
                            <span className="text-base font-bold text-gray-900">
                              {formatPrice(product.discountPrice)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      <button
                        disabled={product.stock === 0}
                        className={`w-full text-center py-2 rounded-md font-bold text-xs tracking-wide uppercase transition-colors ${
                          product.stock === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-900 text-white hover:bg-indigo-600"
                        }`}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
