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
    product: "Floral Summer Midi Dress",
  },
  {
    name: "Usman Tariq",
    location: "Multan",
    rating: 5,
    review:
      "I was skeptical at first but Haanli Bazaar exceeded my expectations. The product quality is outstanding and prices are very reasonable.",
    avatar: "UT",
    product: "ProBook 14 Laptop",
  },
  {
    name: "Fatima Zahra",
    location: "Faisalabad",
    rating: 5,
    review:
      "Received my order within 2 days! The packaging was excellent and the product looks exactly like the photos. Highly recommended!",
    avatar: "FZ",
    product: "Structured Leather Handbag",
  },
  {
    name: "Hassan Raza",
    location: "Rawalpindi",
    rating: 4,
    review:
      "Very smooth shopping experience. The website is easy to navigate and the payment process was secure and quick.",
    avatar: "HR",
    product: "Minimal Steel Wrist Watch",
  },
];

export default function CustomerReviews() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visibleCount = 3;

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
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
    <section className="border-t border-gray-100 bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
            Customer Stories
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            What Our Customers Say
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Feedback from shoppers across Pakistan.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 gap-6 transition-opacity duration-300 md:grid-cols-3 ${
            animating ? "opacity-0" : "opacity-100"
          }`}
        >
          {getVisible().map((review, index) => (
            <div
              key={`${review.name}-${index}`}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star < review.rating
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="flex-1 text-sm leading-relaxed text-gray-600">
                “{review.review}”
              </p>

              <div className="text-[10px] font-semibold uppercase tracking-wide text-indigo-500">
                Purchased: {review.product}
              </div>

              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {review.avatar}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {review.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={review.name}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show review ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "w-6 bg-indigo-600"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}