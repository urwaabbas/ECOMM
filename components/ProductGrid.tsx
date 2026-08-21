"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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

type FilterView = "main" | "category" | "subcategory" | "status";

const productTypesByCategory: Record<string, string[]> = {
  Men: [
    "Shirts",
    "T-Shirts",
    "Jackets",
    "Jeans",
    "Sneakers",
    "Casual Shoes",
    "Sports Shoes",
    "Bags",
    "Watches",
    "Sunglasses",
  ],

  Women: [
    "Dresses",
    "Tops",
    "Jackets",
    "Jeans",
    "Sneakers",
    "Heels",
    "Flats",
    "Bags",
    "Watches",
    "Sunglasses",
  ],

  Electronics: [
    "Laptops",
    "Phones",
    "Headphones",
    "Cameras",
    "Chargers",
    "Keyboards",
    "Power Banks",
  ],

  Accessories: ["Bags", "Watches", "Sunglasses", "Wallets"],
};

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

  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    [],
  );

  const [sort, setSort] = useState("");

  const [sortOpen, setSortOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const [featuredOnly, setFeaturedOnly] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);

  const [filterView, setFilterView] = useState<FilterView>("main");

  const categoriesFromUrl = searchParams.getAll("category");

  const subcategoriesFromUrl = searchParams.getAll("subcategory");

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
    if (categories.length === 0) {
      return;
    }

    if (categoriesFromUrl.length === 0) {
      setSelectedCategories([]);
      return;
    }

    const matchedIds = categories
      .filter((category) =>
        categoriesFromUrl.some(
          (value) =>
            value.toLowerCase() === category.name.toLowerCase() ||
            value === category._id,
        ),
      )
      .map((category) => category._id);

    setSelectedCategories(matchedIds);
  }, [searchParams, categories]);

  useEffect(() => {
    setSearch(searchFromUrl);
    setSelectedSubcategories(subcategoriesFromUrl);
    setFeaturedOnly(featuredFromUrl);
    setOnSaleOnly(saleFromUrl);
  }, [searchParams]);

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
    selectedSubcategories,
    sort,
    onSaleOnly,
    featuredOnly,
  ]);

  useEffect(() => {
    if (!filterOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [filterOpen]);

  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoadingProducts(true);

      try {
        const params = new URLSearchParams();

        if (debouncedSearch) {
          params.append("search", debouncedSearch);
        }

        selectedCategories.forEach((categoryId) => {
          params.append("category", categoryId);
        });

        selectedSubcategories.forEach((subcategory) => {
          params.append("subcategory", subcategory);
        });

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
          setProducts(data.products);
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
    selectedSubcategories,
    sort,
    currentPage,
    onSaleOnly,
    featuredOnly,
  ]);

  const selectedCategoryDocs = categories.filter((category) =>
    selectedCategories.includes(category._id),
  );

  const availableProductTypes = useMemo(() => {
    if (selectedCategoryDocs.length > 0) {
      return Array.from(
        new Set(
          selectedCategoryDocs.flatMap(
            (category) => productTypesByCategory[category.name] || [],
          ),
        ),
      ).sort();
    }

    return Array.from(
      new Set(Object.values(productTypesByCategory).flat()),
    ).sort();
  }, [selectedCategoryDocs]);

  const appliedFilterCount =
    selectedCategories.length +
    selectedSubcategories.length +
    (onSaleOnly ? 1 : 0) +
    (featuredOnly ? 1 : 0);

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

  const toggleCategory = (category: Category) => {
    setSelectedCategories((current) => {
      if (current.includes(category._id)) {
        return current.filter((id) => id !== category._id);
      }

      return [...current, category._id];
    });
  };

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories((current) => {
      if (current.includes(subcategory)) {
        return current.filter((item) => item !== subcategory);
      }

      return [...current, subcategory];
    });
  };

  const applyFiltersToUrl = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("subcategory");
    params.delete("sale");
    params.delete("featured");

    selectedCategoryDocs.forEach((category) => {
      params.append("category", category.name);
    });

    selectedSubcategories.forEach((subcategory) => {
      params.append("subcategory", subcategory);
    });

    if (onSaleOnly) {
      params.set("sale", "true");
    }

    if (featuredOnly) {
      params.set("featured", "true");
    }

    const query = params.toString();

    router.push(query ? `/products?${query}` : "/products");

    setFilterOpen(false);
    setFilterView("main");
  };

  const removeCategoryFilter = (categoryId: string) => {
    setSelectedCategories((current) =>
      current.filter((id) => id !== categoryId),
    );

    const category = categories.find((item) => item._id === categoryId);

    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      const remainingCategories = params
        .getAll("category")
        .filter((value) => value !== category.name && value !== category._id);

      params.delete("category");

      remainingCategories.forEach((value) => {
        params.append("category", value);
      });
    }

    const query = params.toString();

    router.push(query ? `/products?${query}` : "/products");
  };

  const removeSubcategoryFilter = (subcategory: string) => {
    setSelectedSubcategories((current) =>
      current.filter((item) => item !== subcategory),
    );

    const params = new URLSearchParams(searchParams.toString());

    const remainingSubcategories = params
      .getAll("subcategory")
      .filter((value) => value !== subcategory);

    params.delete("subcategory");

    remainingSubcategories.forEach((value) => {
      params.append("subcategory", value);
    });

    const query = params.toString();

    router.push(query ? `/products?${query}` : "/products");
  };

  const removeUrlFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(key);

    const query = params.toString();

    router.push(query ? `/products?${query}` : "/products");
  };

  const clearCatalogFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setOnSaleOnly(false);
    setFeaturedOnly(false);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("subcategory");
    params.delete("sale");
    params.delete("featured");

    const query = params.toString();

    router.push(query ? `/products?${query}` : "/products");
  };

  const clearEverything = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSearch("");
    setDebouncedSearch("");
    setSort("");
    setOnSaleOnly(false);
    setFeaturedOnly(false);
    setCurrentPage(1);

    router.push("/products");
  };

  const handleMobileQuickFilter = (
    type: "all" | "category" | "featured" | "sale",
    value?: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("subcategory");
    params.delete("sale");
    params.delete("featured");

    if (type === "category" && value) {
      params.set("category", value);
    }

    if (type === "featured") {
      params.set("featured", "true");
    }

    if (type === "sale") {
      params.set("sale", "true");
    }

    const query = params.toString();

    router.push(query ? `/products?${query}` : "/products");
  };

  const sortLabel =
    sort === "price_asc"
      ? "Price: Low to High"
      : sort === "price_desc"
        ? "Price: High to Low"
        : "Recommended";

  const singleSelectedCategory =
    selectedCategoryDocs.length === 1 ? selectedCategoryDocs[0] : null;

  return (
    <>
      <div className="mx-auto max-w-7xl px-0 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* SEARCH TITLE */}

        {searchFromUrl && (
          <div className="mb-5 px-4 sm:mb-7 sm:px-0">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500 sm:text-sm sm:normal-case sm:tracking-normal">
              Search results for
            </p>

            <h2 className="mt-1 text-xl font-medium text-gray-900 sm:text-2xl sm:font-bold">
              “{searchFromUrl}”
            </h2>
          </div>
        )}

        {/* ============================================ */}
        {/* ZARA-STYLE MOBILE CATEGORY BAR */}
        {/* ============================================ */}

        <div className="border-y border-gray-200 bg-white sm:hidden">
          <div className="overflow-x-auto">
            <div className="flex min-w-max px-2">
              <button
                type="button"
                onClick={() => handleMobileQuickFilter("all")}
                className={`relative whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wide ${
                  selectedCategories.length === 0 &&
                  !onSaleOnly &&
                  !featuredOnly
                    ? "text-gray-950"
                    : "text-gray-500"
                }`}
              >
                View All
                {selectedCategories.length === 0 &&
                  !onSaleOnly &&
                  !featuredOnly && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gray-950" />
                  )}
              </button>

              {categories.map((category) => {
                const active =
                  singleSelectedCategory?._id === category._id &&
                  !onSaleOnly &&
                  !featuredOnly;

                return (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() =>
                      handleMobileQuickFilter("category", category.name)
                    }
                    className={`relative whitespace-nowrap px-4 py-4 text-xs font-medium uppercase tracking-wide ${
                      active ? "text-gray-950" : "text-gray-500"
                    }`}
                  >
                    {category.name}

                    {active && (
                      <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gray-950" />
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handleMobileQuickFilter("featured")}
                className={`relative whitespace-nowrap px-4 py-4 text-xs font-medium uppercase tracking-wide ${
                  featuredOnly ? "text-gray-950" : "text-gray-500"
                }`}
              >
                Featured
                {featuredOnly && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gray-950" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleMobileQuickFilter("sale")}
                className={`relative whitespace-nowrap px-4 py-4 text-xs font-medium uppercase tracking-wide ${
                  onSaleOnly ? "text-red-600" : "text-red-500"
                }`}
              >
                Sale
                {onSaleOnly && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-red-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* MOBILE SORT + FILTER */}
        {/* ============================================ */}

        <div className="relative border-b border-gray-200 bg-white sm:hidden">
          <div className="grid grid-cols-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((current) => !current)}
                className="flex h-12 w-full items-center justify-center gap-2 border-r border-gray-200 text-xs font-medium uppercase tracking-[0.12em] text-gray-950"
              >
                Sort
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7h11M8 12h8M8 17h5M5 5v14m0 0-2-2m2 2 2-2"
                  />
                </svg>
              </button>

              {sortOpen && (
                <div className="absolute left-0 top-12 z-40 w-[200%] border-b border-gray-200 bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setSort("");
                      setSortOpen(false);
                    }}
                    className={`block w-full border-b border-gray-100 px-5 py-4 text-left text-sm ${
                      sort === ""
                        ? "font-semibold text-gray-950"
                        : "text-gray-600"
                    }`}
                  >
                    Recommended
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSort("price_asc");
                      setSortOpen(false);
                    }}
                    className={`block w-full border-b border-gray-100 px-5 py-4 text-left text-sm ${
                      sort === "price_asc"
                        ? "font-semibold text-gray-950"
                        : "text-gray-600"
                    }`}
                  >
                    Price: Low to High
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSort("price_desc");
                      setSortOpen(false);
                    }}
                    className={`block w-full px-5 py-4 text-left text-sm ${
                      sort === "price_desc"
                        ? "font-semibold text-gray-950"
                        : "text-gray-600"
                    }`}
                  >
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setFilterView("main");
                setFilterOpen(true);
                setSortOpen(false);
              }}
              className="flex h-12 w-full items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-950"
            >
              Filters
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M7 12h10M10 18h4"
                />
              </svg>
              {appliedFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-950 px-1 text-[9px] font-bold text-white">
                  {appliedFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">
              {loadingProducts ? "Loading..." : `${totalProducts} styles`}
            </p>

            {sort && <p className="text-[11px] text-gray-400">{sortLabel}</p>}
          </div>
        </div>

        {/* MOBILE FILTER CHIPS */}

        {appliedFilterCount > 0 && (
          <div className="overflow-x-auto border-b border-gray-100 bg-white sm:hidden">
            <div className="flex min-w-max gap-2 px-4 py-3">
              {selectedCategoryDocs.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => removeCategoryFilter(category._id)}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-2 text-xs text-gray-800"
                >
                  {category.name}
                  <span>×</span>
                </button>
              ))}

              {selectedSubcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  type="button"
                  onClick={() => removeSubcategoryFilter(subcategory)}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-2 text-xs text-gray-800"
                >
                  {subcategory}
                  <span>×</span>
                </button>
              ))}

              {onSaleOnly && (
                <button
                  type="button"
                  onClick={() => {
                    setOnSaleOnly(false);
                    removeUrlFilter("sale");
                  }}
                  className="flex items-center gap-2 bg-red-50 px-3 py-2 text-xs text-red-600"
                >
                  Sale
                  <span>×</span>
                </button>
              )}

              {featuredOnly && (
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedOnly(false);
                    removeUrlFilter("featured");
                  }}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-2 text-xs text-gray-800"
                >
                  Featured
                  <span>×</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* DESKTOP ASOS TOOLBAR */}
        {/* ============================================ */}

        <div className="mb-6 hidden border-y border-gray-200 py-4 sm:block">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((current) => !current)}
                  className="inline-flex h-12 items-center gap-3 border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 transition hover:border-gray-900"
                >
                  <span>Sort</span>

                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M8 7h11M8 12h8M8 17h5M5 5v14m0 0-2-2m2 2 2-2"
                    />
                  </svg>
                </button>

                {sortOpen && (
                  <div className="absolute left-0 top-[52px] z-40 w-56 border border-gray-200 bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setSort("");
                        setSortOpen(false);
                      }}
                      className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
                        sort === ""
                          ? "font-bold text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      Recommended
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSort("price_asc");
                        setSortOpen(false);
                      }}
                      className={`block w-full border-t border-gray-100 px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
                        sort === "price_asc"
                          ? "font-bold text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      Price: Low to High
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSort("price_desc");
                        setSortOpen(false);
                      }}
                      className={`block w-full border-t border-gray-100 px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
                        sort === "price_desc"
                          ? "font-bold text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      Price: High to Low
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setFilterView("main");
                  setFilterOpen(true);
                  setSortOpen(false);
                }}
                className="inline-flex h-12 items-center gap-3 border border-gray-900 bg-white px-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                <span>Filter</span>

                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M4 6h16M7 12h10M10 18h4"
                  />
                </svg>

                {appliedFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
                    {appliedFilterCount}
                  </span>
                )}
              </button>

              {selectedCategoryDocs.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => removeCategoryFilter(category._id)}
                  className="inline-flex h-12 items-center gap-3 bg-gray-100 px-4 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
                >
                  {category.name}
                  <span className="text-lg">×</span>
                </button>
              ))}

              {selectedSubcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  type="button"
                  onClick={() => removeSubcategoryFilter(subcategory)}
                  className="inline-flex h-12 items-center gap-3 bg-gray-100 px-4 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
                >
                  {subcategory}
                  <span className="text-lg">×</span>
                </button>
              ))}

              {onSaleOnly && (
                <button
                  type="button"
                  onClick={() => {
                    setOnSaleOnly(false);
                    removeUrlFilter("sale");
                  }}
                  className="inline-flex h-12 items-center gap-3 bg-red-50 px-4 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  Sale
                  <span className="text-lg">×</span>
                </button>
              )}

              {featuredOnly && (
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedOnly(false);
                    removeUrlFilter("featured");
                  }}
                  className="inline-flex h-12 items-center gap-3 bg-indigo-50 px-4 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                >
                  Featured
                  <span className="text-lg">×</span>
                </button>
              )}

              {appliedFilterCount > 1 && (
                <button
                  type="button"
                  onClick={clearCatalogFilters}
                  className="text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-gray-900"
                >
                  Clear filters
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500">
              {loadingProducts
                ? "Loading products..."
                : `${totalProducts} ${
                    totalProducts === 1 ? "product" : "products"
                  } found`}
            </p>
          </div>

          {sort && (
            <p className="mt-3 text-xs text-gray-400">Sorted by {sortLabel}</p>
          )}
        </div>

        {/* ============================================ */}
        {/* PRODUCTS */}
        {/* ============================================ */}

        <main>
          {loadingProducts ? (
            <div className="grid grid-cols-2 gap-x-px gap-y-7 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden bg-white sm:rounded-lg sm:border sm:border-gray-200"
                >
                  <div className="aspect-[3/4] bg-gray-100 sm:aspect-auto sm:h-72" />

                  <div className="space-y-2 px-2 pt-3 sm:space-y-3 sm:p-4">
                    <div className="h-3 w-16 rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-5 w-24 rounded bg-gray-200" />
                    <div className="h-10 w-full bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mx-4 border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center sm:mx-0">
              <h3 className="text-lg font-bold text-gray-900">
                No products found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                We couldn&apos;t find products matching your current search or
                filters.
              </p>

              <button
                type="button"
                onClick={clearEverything}
                className="mt-6 border border-gray-900 bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Clear search and filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-px gap-y-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
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

                  const ratingAverage = product.ratings?.average || 0;

                  const ratingCount = product.ratings?.count || 0;

                  const roundedRating = Math.round(ratingAverage);

                  return (
                    <article
                      key={pid(product)}
                      className="flex h-full min-w-0 flex-col overflow-hidden bg-white sm:rounded-lg sm:border sm:border-gray-200 sm:transition sm:hover:border-gray-300 sm:hover:shadow-md"
                    >
                      {/* IMAGE */}

                      <div className="relative bg-gray-100">
                        <Link
                          href={`/products/${pid(product)}`}
                          className="block"
                        >
                          <div className="aspect-[3/4] w-full overflow-hidden sm:aspect-auto sm:h-72">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-full w-full object-cover transition duration-300 sm:hover:scale-[1.02]"
                            />
                          </div>
                        </Link>

                        {/* BADGES */}

                        <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5 sm:left-3 sm:top-3 sm:gap-2">
                          {product.isFeatured && (
                            <span className="bg-gray-950 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-white sm:rounded-md sm:px-2.5 sm:text-[10px]">
                              Featured
                            </span>
                          )}

                          {discountPercent !== null && (
                            <span className="bg-red-500 px-2 py-1 text-[8px] font-bold text-white sm:rounded-md sm:px-2.5 sm:text-[10px]">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* WISHLIST */}

                        <button
                          type="button"
                          onClick={() =>
                            inWishlist
                              ? removeFromWishlist(pid(product))
                              : addToWishlist(normalizeProduct(product))
                          }
                          aria-label={
                            inWishlist
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-white/90 text-lg transition sm:right-3 sm:top-3 sm:h-9 sm:w-9 sm:rounded-full sm:border sm:bg-white sm:shadow-sm ${
                            inWishlist
                              ? "text-pink-600 sm:border-pink-200"
                              : "text-gray-800 sm:border-gray-200 sm:text-gray-600 sm:hover:text-pink-600"
                          }`}
                        >
                          {inWishlist ? "♥" : "♡"}
                        </button>
                      </div>

                      {/* CONTENT */}

                      <div className="flex flex-1 flex-col px-2 pt-3 sm:p-4">
                        {/* MOBILE PRODUCT INFO */}

                        <div className="flex flex-1 flex-col sm:hidden">
                          <div className="mb-1 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-gray-400">
                            <span>{product.category?.name}</span>

                            {product.subcategory && (
                              <>
                                <span>/</span>

                                <span>{product.subcategory}</span>
                              </>
                            )}
                          </div>

                          <Link href={`/products/${pid(product)}`}>
                            <h3 className="line-clamp-2 min-h-[40px] text-[13px] font-normal uppercase leading-5 text-gray-900">
                              {product.title}
                            </h3>
                          </Link>

                          <div className="min-h-[48px]">
                            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                              <span
                                className="text-sm font-medium"
                                style={{
                                  color: "#111827",
                                  WebkitTextFillColor: "#111827",
                                }}
                              >
                                {formatPricePKR(
                                  product.discountPrice || product.price,
                                )}
                              </span>

                              {product.discountPrice && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  {formatPricePKR(product.price)}
                                </span>
                              )}
                            </div>

                            {discountPercent !== null && (
                              <p className="mt-1 text-[10px] text-red-600">
                                Save {discountPercent}%
                              </p>
                            )}
                          </div>

                          

                          <button
                            type="button"
                            onClick={() => handleCartToggle(product)}
                            disabled={outOfStock || loading}
                            className={`mt-auto flex h-10 w-full items-center justify-center border text-xs font-medium uppercase tracking-[0.12em] transition ${
                              outOfStock
                                ? "cursor-not-allowed border-gray-200 text-gray-300"
                                : inCart
                                  ? "border-gray-950 bg-gray-950 text-white"
                                  : "border-gray-900 bg-white text-gray-950 active:bg-gray-950 active:text-white"
                            }`}
                          >
                            {outOfStock
                              ? "Out of Stock"
                              : inCart
                                ? "Added"
                                : "Add"}
                          </button>
                        </div>

                        {/* DESKTOP AMAZON CARD INFO */}

                        <div className="hidden flex-1 flex-col sm:flex">
                          <div className="mb-2 flex items-center gap-2 text-[11px]">
                            <span className="font-bold uppercase tracking-wide text-indigo-600">
                              {product.category?.name}
                            </span>

                            {product.subcategory && (
                              <>
                                <span className="text-gray-300">•</span>

                                <span className="text-gray-500">
                                  {product.subcategory}
                                </span>
                              </>
                            )}
                          </div>

                          <Link href={`/products/${pid(product)}`}>
                            <h3 className="min-h-[48px] text-[15px] font-medium leading-6 text-gray-900 transition hover:text-indigo-600">
                              {product.title}
                            </h3>
                          </Link>

                          <div className="mt-2 flex min-h-5 items-center gap-1.5">
                            {ratingCount > 0 ? (
                              <>
                                <span className="text-sm font-medium text-gray-700">
                                  {ratingAverage.toFixed(1)}
                                </span>

                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={`text-sm ${
                                        star <= roundedRating
                                          ? "text-orange-400"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>

                                <span className="text-xs text-indigo-600">
                                  ({ratingCount})
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">
                                No reviews yet
                              </span>
                            )}
                          </div>

                          <div className="mt-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className="text-[26px] font-bold leading-none tracking-tight"
                                style={{
                                  color: "#111827",
                                  WebkitTextFillColor: "#111827",
                                  opacity: 1,
                                }}
                              >
                                {formatPricePKR(
                                  product.discountPrice || product.price,
                                )}
                              </span>

                              {discountPercent !== null && (
                                <span className="text-sm font-semibold text-red-600">
                                  -{discountPercent}%
                                </span>
                              )}
                            </div>

                            {product.discountPrice && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                                <span>List Price:</span>

                                <span className="line-through">
                                  {formatPricePKR(product.price)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mt-3">
                            <p
                              className={`text-sm font-semibold ${
                                outOfStock ? "text-red-600" : "text-emerald-600"
                              }`}
                            >
                              {outOfStock ? "Out of Stock" : "In Stock"}
                            </p>
                          </div>

                          <div className="mt-auto pt-5">
                            <button
                              type="button"
                              onClick={() => handleCartToggle(product)}
                              disabled={outOfStock || loading}
                              className={`w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
                                outOfStock
                                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                  : inCart
                                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "bg-gray-900 text-white hover:bg-indigo-600"
                              }`}
                            >
                              {outOfStock
                                ? "Out of Stock"
                                : inCart
                                  ? "Added to Cart"
                                  : "Add to Cart"}
                            </button>

                            <Link
                              href={`/products/${pid(product)}`}
                              className="mt-3 block text-center text-xs font-medium text-gray-500 transition hover:text-indigo-600"
                            >
                              View product details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* PAGINATION */}

              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5 px-4 sm:gap-2 sm:px-0">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => page - 1)}
                    disabled={currentPage === 1}
                    className="border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 disabled:opacity-40 sm:px-4 sm:text-sm"
                  >
                    ← Previous
                  </button>

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 border text-xs font-semibold sm:h-10 sm:w-10 sm:text-sm ${
                        currentPage === page
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => page + 1)}
                    disabled={currentPage === totalPages}
                    className="border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 disabled:opacity-40 sm:px-4 sm:text-sm"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ============================================ */}
      {/* FILTER DRAWER */}
      {/* ============================================ */}

      {filterOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/45"
          onClick={() => {
            setFilterOpen(false);
            setFilterView("main");
          }}
        >
          <aside
            className="flex h-full w-full flex-col bg-white shadow-2xl sm:max-w-[480px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5 sm:h-20 sm:px-6">
              {filterView !== "main" ? (
                <button
                  type="button"
                  onClick={() => setFilterView("main")}
                  className="flex h-10 w-10 items-center justify-center text-gray-950"
                >
                  ←
                </button>
              ) : (
                <div className="w-10" />
              )}

              <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-gray-950 sm:text-xl sm:font-black sm:tracking-[0.12em]">
                {filterView === "main" && "Filter"}

                {filterView === "category" && "Category"}

                {filterView === "subcategory" && "Product Type"}

                {filterView === "status" && "Sale / Featured"}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setFilterOpen(false);
                  setFilterView("main");
                }}
                className="flex h-10 w-10 items-center justify-center text-2xl text-gray-950 sm:text-3xl"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filterView === "main" && (
                <>
                  <button
                    type="button"
                    onClick={() => setFilterView("category")}
                    className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-6 text-left sm:px-7 sm:py-7"
                  >
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        Category
                      </p>

                      {selectedCategoryDocs.length > 0 && (
                        <p className="mt-1 text-xs text-indigo-600">
                          {selectedCategoryDocs
                            .map((category) => category.name)
                            .join(", ")}
                        </p>
                      )}
                    </div>

                    <span className="text-2xl text-gray-400">›</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterView("subcategory")}
                    className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-6 text-left sm:px-7 sm:py-7"
                  >
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        Product Type
                      </p>

                      {selectedSubcategories.length > 0 && (
                        <p className="mt-1 text-xs text-indigo-600">
                          {selectedSubcategories.join(", ")}
                        </p>
                      )}
                    </div>

                    <span className="text-2xl text-gray-400">›</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterView("status")}
                    className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-6 text-left sm:px-7 sm:py-7"
                  >
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        Sale / Featured
                      </p>

                      {(onSaleOnly || featuredOnly) && (
                        <p className="mt-1 text-xs text-indigo-600">
                          {[
                            onSaleOnly ? "Sale" : "",
                            featuredOnly ? "Featured" : "",
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>

                    <span className="text-2xl text-gray-400">›</span>
                  </button>
                </>
              )}

              {filterView === "category" && (
                <div>
                  {categories.map((category) => {
                    const selected = selectedCategories.includes(category._id);

                    return (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-5 text-left sm:px-7 sm:py-6"
                      >
                        <span className="text-gray-900">{category.name}</span>

                        <span
                          className={`flex h-6 w-6 items-center justify-center border ${
                            selected
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selected ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {filterView === "subcategory" && (
                <div>
                  {availableProductTypes.map((type) => {
                    const selected = selectedSubcategories.includes(type);

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleSubcategory(type)}
                        className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-5 text-left sm:px-7 sm:py-6"
                      >
                        <span className="text-gray-900">{type}</span>

                        <span
                          className={`flex h-6 w-6 items-center justify-center border ${
                            selected
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selected ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {filterView === "status" && (
                <div>
                  <button
                    type="button"
                    onClick={() => setOnSaleOnly((current) => !current)}
                    className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-5 text-left sm:px-7 sm:py-6"
                  >
                    <span>Sale</span>

                    <span
                      className={`flex h-6 w-6 items-center justify-center border ${
                        onSaleOnly
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {onSaleOnly ? "✓" : ""}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeaturedOnly((current) => !current)}
                    className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-5 text-left sm:px-7 sm:py-6"
                  >
                    <span>New & Featured</span>

                    <span
                      className={`flex h-6 w-6 items-center justify-center border ${
                        featuredOnly
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {featuredOnly ? "✓" : ""}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-gray-200 bg-white p-4 sm:p-5">
              <button
                type="button"
                onClick={clearCatalogFilters}
                disabled={appliedFilterCount === 0}
                className="h-13 border border-gray-400 bg-white px-2 text-xs font-bold uppercase tracking-[0.12em] text-gray-900 disabled:text-gray-300 sm:h-14 sm:text-sm"
              >
                Clear All
              </button>

              <button
                type="button"
                onClick={applyFiltersToUrl}
                className="h-13 bg-gray-950 px-2 text-xs font-bold uppercase tracking-[0.12em] text-white sm:h-14 sm:text-sm"
              >
                View Items
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default function ProductGrid() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-0 py-4 sm:px-6 sm:py-8 lg:px-8">
          <div className="grid grid-cols-2 gap-x-px gap-y-7 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden bg-white sm:rounded-lg sm:border sm:border-gray-200"
              >
                <div className="aspect-[3/4] bg-gray-100 sm:aspect-auto sm:h-72" />

                <div className="space-y-2 px-2 py-3 sm:p-4">
                  <div className="h-3 w-16 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-5 w-24 rounded bg-gray-200" />
                  <div className="h-10 w-full bg-gray-200" />
                </div>
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
