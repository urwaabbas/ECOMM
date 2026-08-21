"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  subcategory?: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  category: Category;
  ratings: {
    average: number;
    count: number;
  };
}

interface ProductSection {
  title: string;
  description: string;
  href: string;
  products: Product[];
}

export default function HomeProductSections() {
  const {
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    isInCart,
    isInWishlist,
    loading,
  } = useShopping();

  const [sections, setSections] = useState<ProductSection[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const [
          menResponse,
          womenResponse,
          electronicsResponse,
          accessoriesResponse,
          saleResponse,
        ] = await Promise.all([
          fetch("/api/products?category=Men"),
          fetch("/api/products?category=Women"),
          fetch("/api/products?category=Electronics"),
          fetch("/api/products?category=Accessories"),
          fetch("/api/products?sale=true"),
        ]);

        const [
          menData,
          womenData,
          electronicsData,
          accessoriesData,
          saleData,
        ] = await Promise.all([
          menResponse.json(),
          womenResponse.json(),
          electronicsResponse.json(),
          accessoriesResponse.json(),
          saleResponse.json(),
        ]);

        setSections([
          {
            title: "Men's Collection",
            description:
              "Everyday essentials, footwear, outerwear and accessories.",
            href: "/products?category=Men",
            products: menData.success ? menData.products.slice(0, 4) : [],
          },
          {
            title: "Women's Collection",
            description:
              "Modern dresses, everyday styles, footwear and accessories.",
            href: "/products?category=Women",
            products: womenData.success ? womenData.products.slice(0, 4) : [],
          },
          {
            title: "Latest Electronics",
            description:
              "Laptops, phones, headphones, cameras and everyday tech.",
            href: "/products?category=Electronics",
            products: electronicsData.success
              ? electronicsData.products.slice(0, 4)
              : [],
          },
          {
            title: "Accessories",
            description:
              "Bags, watches, sunglasses and wallets for every style.",
            href: "/products?category=Accessories",
            products: accessoriesData.success
              ? accessoriesData.products.slice(0, 4)
              : [],
          },
          {
            title: "Deals You'll Love",
            description:
              "Save on selected products across our most popular collections.",
            href: "/products?sale=true",
            products: saleData.success ? saleData.products.slice(0, 4) : [],
          },
        ]);
      } catch (error) {
        console.error("Failed to load homepage products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchHomeProducts();
  }, []);

  const normalizeProduct = (product: Product) => ({
    ...product,
    _id: product._id.toString(),
    images: product.images,
  });

  const handleCartToggle = (product: Product) => {
    if (isInCart(product._id)) {
      removeFromCart(product._id);
    } else {
      addToCart(normalizeProduct(product));
    }
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(normalizeProduct(product));
    }
  };

  if (loadingProducts) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 h-7 w-56 animate-pulse rounded bg-gray-200" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
            >
              <div className="aspect-square animate-pulse bg-gray-200" />

              <div className="space-y-3 p-4">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div>
      {sections.map((section, sectionIndex) => {
        if (section.products.length === 0) return null;

        const isSaleSection = section.href.includes("sale=true");

        return (
          <section
            key={section.title}
            className={
              sectionIndex % 2 === 0
                ? "bg-white"
                : "border-y border-gray-100 bg-gray-50"
            }
          >
            <div className="mx-auto max-w-6xl px-4 py-16">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className={`mb-2 text-xs font-bold uppercase tracking-[0.25em] ${
                      isSaleSection ? "text-red-500" : "text-indigo-600"
                    }`}
                  >
                    {isSaleSection ? "Limited Offers" : "Shop Haanli"}
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {section.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {section.description}
                  </p>
                </div>

                <Link
                  href={section.href}
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-indigo-600"
                >
                  Shop all
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {section.products.map((product) => {
                  const inCart = isInCart(product._id);
                  const inWishlist = isInWishlist(product._id);
                  const outOfStock = product.stock === 0;

                  const discountPercent = product.discountPrice
                    ? Math.round(
                        ((product.price - product.discountPrice) /
                          product.price) *
                          100,
                      )
                    : null;

                  return (
                    <article
                      key={product._id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Link
                        href={`/products/${product._id}`}
                        className="block"
                      >
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          {product.isFeatured && (
                            <span className="absolute left-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                              Featured
                            </span>
                          )}

                          {discountPercent !== null && (
                            <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                              {product.category?.name}
                            </p>

                            {product.subcategory && (
                              <p className="truncate text-[11px] text-gray-400">
                                {product.subcategory}
                              </p>
                            )}
                          </div>

                          <h3 className="line-clamp-2 min-h-12 font-semibold leading-6 text-gray-900">
                            {product.title}
                          </h3>

                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-bold text-gray-900">
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

                      <div className="mt-auto flex gap-2 px-4 pb-4">
                        <button
                          type="button"
                          onClick={() => handleCartToggle(product)}
                          disabled={outOfStock || loading}
                          className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
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

                        <button
                          type="button"
                          onClick={() => handleWishlistToggle(product)}
                          aria-label={
                            inWishlist
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-lg transition ${
                            inWishlist
                              ? "border-pink-200 bg-pink-50 text-pink-600"
                              : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {inWishlist ? "♥" : "♡"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}