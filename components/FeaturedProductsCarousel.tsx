"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { formatPricePKR } from "@/lib/utilis";

interface Product {
  _id: string;
  title: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  category: { name: string };
}

export default function FeaturedProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products.slice(0, 8));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [products]);

  const goTo = (index: number) => {
    setCurrent(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3000);
  };

  const prev = () => goTo((current - 1 + products.length) % products.length);
  const next = () => goTo((current + 1) % products.length);

  if (products.length === 0) return null;

  const product = products[current];
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Featured Products
      </h2>

      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
          <div className="relative overflow-hidden bg-gray-50">
            {products.map((p, i) => (
              <div
                key={p._id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {discountPercent && (
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {discountPercent}% OFF
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
              {product.category?.name}
            </span>
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              {product.title}
            </h3>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-black text-gray-900">
                {formatPricePKR(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPricePKR(product.price)}
                </span>
              )}
            </div>

            <Link
              href={`/products/${product._id}`}
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition w-fit"
            >
              View Product
            </Link>
          </div>
        </div>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-50 transition z-10"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-50 transition z-10"
        >
          ›
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-indigo-600" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}