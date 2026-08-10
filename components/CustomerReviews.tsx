"use client";

import { useEffect, useRef, useState } from "react";

const reviews = [
  {
    name: "Aisha Khan",
    location: "Karachi",
    rating: 5,
    review:
      "Absolutely love shopping at Haanli Bazaar! The products are top quality and delivery was super fast. Will definitely order again.",
    avatar: "AK",
    product: "Premium Wireless Headphones",
  },
  {
    name: "Bilal Ahmed",
    location: "Lahore",
    rating: 5,
    review:
      "Best online shopping experience in Pakistan. The checkout was smooth and my order arrived in perfect condition.",
    avatar: "BA",
    product: "Ergonomic Mechanical Keyboard",
  },
  {
    name: "Sara Malik",
    location: "Islamabad",
    rating: 4,
    review:
      "Great selection of products at competitive prices. Customer support was very helpful when I had a question about my order.",
    avatar: "SM",
    product: "Yoga Mat Pro",
  },
  {
    name: "Usman Tariq",
    location: "Multan",
    rating: 5,
    review:
      "I was skeptical at first but Haanli Bazaar exceeded my expectations. The product quality is outstanding and prices are very reasonable.",
    avatar: "UT",
    product: "Ultra-Wide Gaming Monitor",
  },
  {
    name: "Fatima Zahra",
    location: "Faisalabad",
    rating: 5,
    review:
      "Received my order within 2 days! The packaging was excellent and the product looks exactly like the photos. Highly recommended!",
    avatar: "FZ",
    product: "Minimalist Leather Wallet",
  },
  {
    name: "Hassan Raza",
    location: "Rawalpindi",
    rating: 4,
    review:
      "Very smooth shopping experience. The website is easy to navigate and the payment process was secure and quick.",
    avatar: "HR",
    product: "Smart Fitness Band",
  },
];

export default function CustomerReviews() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visibleCount = 3;

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % reviews.length);
        setAnimating(false);
      }, 300);
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = (index: number) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
    startTimer();
  };

  const getVisible = () => {
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      visible.push(reviews[(current + i) % reviews.length]);
    }
    return visible;
  };

  return (
    <section className="bg-gray-50 border-t border-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Trusted by thousands of happy shoppers across Pakistan
          </p>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${
            animating ? "opacity-0" : "opacity-100"
          }`}
        >
          {getVisible().map((review, i) => (
            <div
              key={`${review.name}-${i}`}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, s) => (
                  <span
                    key={s}
                    className={`text-sm ${
                      s < review.rating ? "text-yellow-400" : "text-gray-200"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                "{review.review}"
              </p>

              <div className="text-[10px] text-indigo-500 font-semibold uppercase tracking-wide">
                Purchased: {review.product}
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {review.name}
                  </p>
                  <p className="text-xs text-gray-400">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
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