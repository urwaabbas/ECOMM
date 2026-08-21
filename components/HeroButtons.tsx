"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const slides = [
  {
    heading: "Welcome to Haanli Bazaar",
    description:
      "Discover fashion, electronics, accessories and everyday essentials across our growing marketplace.",
    buttonText: "Shop All Products",
    buttonHref: "/products",
  },
  {
    heading: "New & Featured",
    description:
      "Explore selected products from our latest and featured collections across Haanli Bazaar.",
    buttonText: "Explore Featured",
    buttonHref: "/products?featured=true",
  },
  {
    heading: "Style for Him",
    description:
      "Shop shirts, T-shirts, jackets, jeans, sneakers, watches and more from our men's collection.",
    buttonText: "Shop Men",
    buttonHref: "/products?category=Men",
  },
  {
    heading: "Style for Her",
    description:
      "Discover dresses, tops, denim, footwear, handbags and accessories from our women's collection.",
    buttonText: "Shop Women",
    buttonHref: "/products?category=Women",
  },
  {
    heading: "Latest Electronics",
    description:
      "Browse laptops, smartphones, headphones, cameras, keyboards, chargers and everyday technology.",
    buttonText: "Explore Electronics",
    buttonHref: "/products?category=Electronics",
  },
  {
    heading: "Accessories for Every Style",
    description:
      "Complete your look with bags, watches, sunglasses and wallets from our accessories collection.",
    buttonText: "Shop Accessories",
    buttonHref: "/products?category=Accessories",
  },
  {
    heading: "Deals Worth Shopping",
    description:
      "Save on selected fashion, electronics and accessories while our latest offers are available.",
    buttonText: "Shop Sale",
    buttonHref: "/products?sale=true",
  },
];

export default function HeroSection() {
  const { data: session } = useSession();

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);

      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const changeSlide = (index: number) => {
    if (index === current) return;

    setAnimating(true);

    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  const slide = slides[current];

  return (
    <section className="relative h-[70vh] min-h-[650px] max-h-[850px] overflow-hidden border-b border-gray-200">
      <div className="absolute inset-0">
        <img
          src="/hero.png"
          alt="Haanli Bazaar"
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/55" />
      </div>
      <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center">
        <div
          className={`transition-all duration-500 ${
            animating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/75">
            Haanli Bazaar
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {slide.heading}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg">
            {slide.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={slide.buttonHref}
              className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100"
            >
              {slide.buttonText}
            </Link>

            {!session?.user && (
              <Link
                href="/register"
                className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-full border border-white/80 bg-black/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-900"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {slides.map((slideItem, index) => (
            <button
              key={slideItem.heading}
              type="button"
              onClick={() => changeSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === current
                  ? "w-7 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
