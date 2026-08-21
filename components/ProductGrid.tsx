"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useShopping } from "@/components/ShoppingProvider";
import { formatPricePKR } from "@/lib/utilis";
import { useRouter, useSearchParams } from "next/navigation";

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
  subcategory?: string;
}

function ProductGridContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    addToCart,
    removeFromCart,
    addToWishlist,
    isInCart,
    isInWishlist,
    removeFromWishlist,
    loading,
  } = useShopping();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const categoryFromUrl = searchParams.get("category");
  const subcategoryFromUrl = searchParams.get("subcategory") || "";
  const searchFromUrl = searchParams.get("search") || "";
  const featuredFromUrl = searchParams.get("featured") === "true";
  const saleFromUrl = searchParams.get("sale") === "true";

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
    if (categories.length === 0) return;

    if (!categoryFromUrl) {
      setSelectedCategories([]);
      return;
    }

    const matched = categories.find(
      (cat) => cat.name.toLowerCase() === categoryFromUrl.toLowerCase(),
    );

    if (matched) {
      setSelectedCategories([matched._id]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryFromUrl, categories]);

  useEffect(() => {
    setSearch(searchFromUrl);
    setSelectedSubcategory(subcategoryFromUrl);
    setFeaturedOnly(featuredFromUrl);
    setOnSaleOnly(saleFromUrl);
  }, [
    searchFromUrl,
    subcategoryFromUrl,
    featuredFromUrl,
    saleFromUrl,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    selectedCategories,
    selectedSubcategory,
    sort,
    onSaleOnly,
    featuredOnly,
  ]);

  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoadingProducts(true);

      try {
        const params = new URLSearchParams();

        if (debouncedSearch) {
          params.append("search", debouncedSearch);
        }

        if (selectedCategories.length === 1) {
          params.append("category", selectedCategories[0]);
        }

        if (selectedSubcategory) {
          params.append("subcategory", selectedSubcategory);
        }

        if (featuredOnly) {
          params.append("featured", "true");
        }

        if (onSaleOnly) {
          params.append("sale", "true");
        }

        if (sort) {
          params.append("sort", sort);
        }

        params.append("page", currentPage.toString());

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          let filtered = data.products;

          if (selectedCategories.length > 1) {
            filtered = filtered.filter((product: Product) =>
              selectedCategories.includes(product.category._id),
            );
          }

          setProducts(filtered);
          setTotalPages(data.totalPages || 1);
          setTotalProducts(data.totalProducts || 0);
        } else {
          setProducts([]);
          setTotalPages(1);
          setTotalProducts(0);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchFilteredProducts();
  }, [
    debouncedSearch,
    selectedCategories,
    selectedSubcategory,
    sort,
    currentPage,
    onSaleOnly,
    featuredOnly,
  ]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  };

  const removeUrlFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(key);

    const query = params.toString();

    router.push(query ? `/products?${query}` : "/products");
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategory("");
    setSearch("");
    setDebouncedSearch("");
    setSort("");
    setOnSaleOnly(false);
    setFeaturedOnly(false);
    setCurrentPage(1);

    router.push("/products");
  };

  const normalizeProduct = (product: Product) => ({
    ...product,
    _id: product._id.toString(),
    images: product.images,
  });

  const pid = (product: Product) => product._id.toString();

  const handleCartToggle = (product: Product) => {
    if (isInCart(pid(product))) {
      removeFromCart(pid(product));
    } else {
      addToCart(normalizeProduct(product));
    }
  };

  const handleSaleToggle = () => {
    if (saleFromUrl) {
      removeUrlFilter("sale");
      return;
    }

    setOnSaleOnly((prev) => !prev);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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

        {(selectedCategories.length > 0 ||
          selectedSubcategory ||
          featuredOnly ||
          onSaleOnly) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCategories.map((id) => {
              const cat = categories.find((category) => category._id === id);

              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {cat?.name}

                  <button
                    type="button"
                    onClick={() => {
                      if (categoryFromUrl) {
                        const params = new URLSearchParams(
                          searchParams.toString(),
                        );

                        params.delete("category");
                        params.delete("subcategory");

                        const query = params.toString();

                        router.push(
                          query ? `/products?${query}` : "/products",
                        );
                      } else {
                        toggleCategory(id);
                      }
                    }}
                    className="ml-1 hover:text-indigo-900"
                  >
                    ×
                  </button>
                </span>
              );
            })}

            {selectedSubcategory && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                {selectedSubcategory}

                <button
                  type="button"
                  onClick={() => removeUrlFilter("subcategory")}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            )}

            {featuredOnly && (
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                Featured

                <button
                  type="button"
                  onClick={() => removeUrlFilter("featured")}
                  className="ml-1 hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            )}

            {onSaleOnly && (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                On Sale

                <button
                  type="button"
                  onClick={() => {
                    if (saleFromUrl) {
                      removeUrlFilter("sale");
                    } else {
                      setOnSaleOnly(false);
                    }
                  }}
                  className="ml-1 hover:text-red-900"
                >
                  ×
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-gray-400 hover:text-red-500 transition"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Categories
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Select one or more categories.
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategories([]);

                if (categoryFromUrl || subcategoryFromUrl) {
                  const params = new URLSearchParams(
                    searchParams.toString(),
                  );

                  params.delete("category");
                  params.delete("subcategory");

                  const query = params.toString();

                  router.push(
                    query ? `/products?${query}` : "/products",
                  );
                }
              }}
              className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
                selectedCategories.length === 0
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50"
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => {
                  if (categoryFromUrl || subcategoryFromUrl) {
                    router.push(
                      `/products?category=${encodeURIComponent(cat.name)}`,
                    );
                    return;
                  }

                  toggleCategory(cat._id);
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl border transition flex items-center justify-between ${
                  selectedCategories.includes(cat._id)
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                }`}
              >
                <span>{cat.name}</span>

                {selectedCategories.includes(cat._id) && (
                  <span className="text-indigo-600 font-bold">✓</span>
                )}
              </button>
            ))}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSaleToggle}
                className={`w-full text-left px-4 py-3 rounded-2xl border transition flex items-center justify-between ${
                  onSaleOnly
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-red-300 hover:bg-red-50/50"
                }`}
              >
                <span className="font-medium">On Sale</span>

                {onSaleOnly && (
                  <span className="text-red-600 font-bold">✓</span>
                )}
              </button>
            </div>
          </div>

          {categories.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Categories are loading or unavailable.
            </p>
          )}
        </aside>

        <main className="flex-1">
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white border border-gray-100 rounded-xl p-4 h-96"
                >
                  <div className="bg-gray-200 h-48 rounded-lg mb-4" />
                  <div className="bg-gray-200 h-4 w-2/3 rounded mb-2" />
                  <div className="bg-gray-200 h-4 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">
                No products found matching your filters.
              </p>

              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-4 text-sm text-indigo-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  const inCart = isInCart(pid(product));
                  const inWishlist = isInWishlist(pid(product));
                  const outOfStock = product.stock === 0;

                  const discountPercent = product.discountPrice
                    ? Math.round(
                        ((product.price - product.discountPrice) /
                          product.price) *
                          100,
                      )
                    : null;

                  return (
                    <div
                      key={pid(product)}
                      className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <Link
                          href={`/products/${pid(product)}`}
                          className="block"
                        >
                          <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />

                            {product.isFeatured && (
                              <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
                                Featured
                              </span>
                            )}

                            {discountPercent && (
                              <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          <div className="p-4">
                            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
                              {product.category?.name}
                            </p>

                            {product.subcategory && (
                              <p className="mt-1 text-[11px] text-gray-400">
                                {product.subcategory}
                              </p>
                            )}

                            <h3 className="font-bold text-gray-800 mt-1">
                              {product.title}
                            </h3>

                            <div className="flex items-baseline gap-2 mt-2">
                              <span className="text-gray-900 font-semibold">
                                {formatPricePKR(
                                  product.discountPrice || product.price,
                                )}
                              </span>

                              {product.discountPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPricePKR(product.price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>

                      <div className="px-4 pb-4 space-y-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleCartToggle(product)}
                            disabled={outOfStock || loading}
                            className={`flex-1 rounded-md px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] transition ${
                              outOfStock
                                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                : inCart
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                          >
                            {outOfStock
                              ? "Out of Stock"
                              : inCart
                                ? "✓ Added"
                                : "Add to Cart"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              inWishlist
                                ? removeFromWishlist(pid(product))
                                : addToWishlist(
                                    normalizeProduct(product),
                                  )
                            }
                            className={`w-11 rounded-md border text-lg transition ${
                              inWishlist
                                ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {inWishlist ? "♥" : "♡"}
                          </button>
                        </div>

                        <Link
                          href={`/products/${pid(product)}`}
                          className="block w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-gray-700 transition hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => page - 1)
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ← Previous
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 text-sm font-semibold rounded-lg border transition ${
                        currentPage === page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => page + 1)
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next →
                  </button>
                </div>
              )}

              {totalProducts > 0 && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  Showing {(currentPage - 1) * 12 + 1}–
                  {Math.min(currentPage * 12, totalProducts)} of{" "}
                  {totalProducts} products
                </p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductGrid() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white border border-gray-100 rounded-xl p-4 h-96"
              >
                <div className="bg-gray-200 h-48 rounded-lg mb-4" />
                <div className="bg-gray-200 h-4 w-2/3 rounded mb-2" />
                <div className="bg-gray-200 h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ProductGridContent />
    </Suspense>
  );
}