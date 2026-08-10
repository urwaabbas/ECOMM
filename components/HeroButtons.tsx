"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const slides = [
  {
    heading: "Welcome to Haanli Bazaar",
    description:
      "Browse premium products across Electronics, Apparel, Home & Living, and Fitness.",
    buttonText: "Shop Now",
    buttonHref: "/products",
  },
  {
    heading: "Top Electronics Deals",
    description:
      "Discover the latest gadgets and devices at unbeatable prices. From headphones to monitors.",
    buttonText: "Explore Electronics",
    buttonHref: "/products?category=Electronics",
  },
  {
    heading: "Fresh Arrivals in Apparel",
    description:
      "Stay stylish with our latest collection of clothing and accessories for every occasion.",
    buttonText: "Shop Apparel",
    buttonHref: "/products?category=Apparel",
  },
  {
    heading: "Transform Your Home",
    description:
      "Find everything you need to make your living space beautiful, comfortable, and functional.",
    buttonText: "Shop Home & Living",
    buttonHref: "/products?category=Home & Living",
  },
  {
    heading: "Fitness Starts Here",
    description:
      "Achieve your health goals with our premium fitness equipment and accessories.",
    buttonText: "Shop Fitness",
    buttonHref: "/products?category=Fitness",
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
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative border-b border-gray-200 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/hero.png"
          alt="Haanli Bazaar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-28 text-center">
        <div
          className={`transition-all duration-400 ${
            animating
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            {slide.heading}
          </h1>
          <p className="mt-4 text-gray-200 max-w-xl mx-auto text-lg">
            {slide.description}
          </p>

          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <Link
              href={slide.buttonHref}
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              {slide.buttonText}
            </Link>
            {!session?.user && (
              <Link
                href="/register"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setAnimating(true);
                setTimeout(() => {
                  setCurrent(i);
                  setAnimating(false);
                }, 400);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}