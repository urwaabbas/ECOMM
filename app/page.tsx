import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-6">
            ✨ New Season Arrivals Are Live
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 max-w-3xl leading-tight">
            Elevate Your Daily Routine With Premium Essentials
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Discover premium products designed for everyday comfort, modern
            style, and effortless shopping.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Shop Products
            </Link>
            <Link
              href="/products"
              className="border border-gray-200 text-gray-900 px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              View Catalog
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-indigo-600 font-semibold mb-4">
            Discover what’s new
          </p>
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            A dedicated landing experience, with product browsing kept separate.
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Start on the homepage and move to the product listing page to
            explore detailed product information for each item.
          </p>
        </div>
      </section>
    </div>
  );
}
