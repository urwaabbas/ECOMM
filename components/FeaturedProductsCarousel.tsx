"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPricePKR } from "@/lib/utilis";

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
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

export default function FeaturedProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?featured=true");
        const data = await res.json();

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products.slice(0, 8));
        }
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [products]);

  const restartTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (products.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);
  };

  const goTo = (index: number) => {
    setCurrent(index);
    restartTimer();
  };

  const previous = () => {
    const previousIndex = (current - 1 + products.length) % products.length;

    goTo(previousIndex);
  };

  const next = () => {
    const nextIndex = (current + 1) % products.length;

    goTo(nextIndex);
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8">
          <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-8 w-64 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
          <div className="grid min-h-[430px] grid-cols-1 md:grid-cols-2">
            <div className="animate-pulse bg-gray-200" />

            <div className="flex flex-col justify-center space-y-5 p-8 md:p-12">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-11 w-36 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const product = products[current];

  const discountPercent = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
            Handpicked for You
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            New & Featured
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Explore selected products from across Haanli Bazaar.
          </p>
        </div>

        <Link
          href="/products?featured=true"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-indigo-600"
        >
          View all featured
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="grid min-h-[430px] grid-cols-1 md:grid-cols-2">
          <Link
            href={`/products/${product._id}`}
            className="relative min-h-[350px] overflow-hidden bg-gray-100 md:min-h-[430px]"
          >
            {products.map((item, index) => (
              <div
                key={item._id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === current
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}

            <span className="absolute left-4 top-4 z-10 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Featured
            </span>

            {discountPercent !== null && (
              <span className="absolute right-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold text-white">
                {discountPercent}% OFF
              </span>
            )}
          </Link>

          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {product.category?.name}
              </span>

              {product.subcategory && (
                <>
                  <span className="text-gray-300">•</span>

                  <span className="text-xs font-medium text-gray-400">
                    {product.subcategory}
                  </span>
                </>
              )}
            </div>

            <h3 className="text-2xl font-black leading-tight text-gray-900 sm:text-3xl">
              {product.title}
            </h3>

            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-500">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-black text-gray-900 sm:text-3xl">
                {formatPricePKR(product.discountPrice || product.price)}
              </span>

              {product.discountPrice && (
                <span className="text-base text-gray-400 line-through">
                  {formatPricePKR(product.price)}
                </span>
              )}
            </div>

            {product.stock > 0 ? (
              <p className="mt-3 text-xs font-semibold text-emerald-600">
                In Stock
              </p>
            ) : (
              <p className="mt-3 text-xs font-semibold text-red-500">
                Out of Stock
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/products/${product._id}`}
                className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-full bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                View Product
              </Link>

              <Link
                href="/products?featured=true"
                className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-full border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Shop Featured
              </Link>
            </div>
          </div>
        </div>

        {products.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous featured product"
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-gray-700 shadow-md transition hover:bg-gray-100"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next featured product"
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-gray-700 shadow-md transition hover:bg-gray-100"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {products.map((item, index) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show ${item.title}`}
                  className={`h-2 rounded-full transition-all ${
                    index === current
                      ? "w-7 bg-indigo-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
