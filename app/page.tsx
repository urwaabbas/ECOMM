import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import HomeBottomSection from "@/components/HomeBottomSection";
import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import CustomerReviews from "@/components/CustomerReviews";
import HeroSection from "@/components/HeroButtons";
import HomeProductSections from "@/components/HomeProductSections";

const categories = [
  {
    name: "Men",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    desc: "Clothing, shoes & accessories",
  },
  {
    name: "Women",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    desc: "Fashion, footwear & accessories",
  },
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=85",
    desc: "Phones, laptops & everyday tech",
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85",
    desc: "Bags, watches, wallets & sunglasses",
  },
];
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      {/* SHOP BY CATEGORY */}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
            Explore Haanli
          </p>

          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Shop by Category
          </h2>

          <p className="text-sm text-gray-500">
            Explore our main collections and find exactly what you are looking
            for.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group relative block h-80 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg sm:h-96"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl font-bold text-white drop-shadow-md">
                  {category.name}
                </h3>

                <p className="mt-1 text-sm font-medium text-white/90 drop-shadow">
                  {category.desc}
                </p>

                <p className="mt-3 text-xs font-semibold text-white">
                  Shop collection →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}

      <FeaturedProductsCarousel />

      {/* REAL PRODUCT COLLECTIONS */}

      <HomeProductSections />

{/* WHY HAANLI BAZAAR */}

<section className="border-y border-gray-100 bg-gray-50">
  <div className="mx-auto max-w-6xl px-4 py-16">
    <div className="mb-10 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
        Shop With Confidence
      </p>

      <h2 className="mt-2 text-3xl font-bold text-gray-900">
        Why Haanli Bazaar?
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
        Everything you need for a simple, secure and convenient shopping
        experience.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

      {/* SECURE PAYMENTS */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm2-10V7a4 4 0 118 0v4"
            />
          </svg>
        </div>

        <h3 className="text-base font-bold text-gray-900">
          Secure Payments
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Protected online payments with secure checkout processing.
        </p>
      </div>

      {/* DELIVERY */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 7h11v10H3V7zm11 3h4l3 3v4h-7v-7zM7 20a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"
            />
          </svg>
        </div>

        <h3 className="text-base font-bold text-gray-900">
          Reliable Delivery
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Convenient delivery for orders across Pakistan.
        </p>
      </div>

      {/* RETURNS */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M4 4v6h6M20 20v-6h-6M5.5 14a7 7 0 0011.8 3M18.5 10A7 7 0 006.7 7"
            />
          </svg>
        </div>

        <h3 className="text-base font-bold text-gray-900">
          Easy Returns
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Eligible purchases can be returned within our 7-day return window.
        </p>
      </div>

      {/* SUPPORT */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M18 10a6 6 0 10-12 0v4a2 2 0 002 2h1v-6H6m12 0h-3v6h1a2 2 0 002-2v-4zm-3 6c0 2-1.5 3-3 3"
            />
          </svg>
        </div>

        <h3 className="text-base font-bold text-gray-900">
          Customer Support
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Get help with products, orders, payments and delivery whenever needed.
        </p>
      </div>
    </div>
  </div>
</section>
      {/* CUSTOMER REVIEWS */}

      <CustomerReviews />

      
    </div>
  );
}
