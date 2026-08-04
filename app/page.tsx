import Link from "next/link";
import Newsletter from "@/components/Newsletter";

const categories = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    desc: "Gadgets & devices",
  },
  {
    name: "Apparel",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop",
    desc: "Clothing & accessories",
  },
  {
    name: "Home & Living",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
    desc: "Home essentials",
  },
  {
    name: "Fitness",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    desc: "Sports & fitness",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Welcome to Haanli Bazaar
          </h1>
          <p className="mt-4 text-gray-200 max-w-xl mx-auto text-lg">
            Browse premium products across Electronics, Apparel, Home & Living,
            and Fitness.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/register"
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-300 hover:shadow-md transition"
            >
              <div className="w-full h-36 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Haanli Bazaar?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 overflow-hidden">
                <img
                  src="/secure-img.png"
                  alt="Secure Payments"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Secure Payments
              </h3>
              <p className="text-sm text-gray-500">
                Powered by Stripe — your payment details are always safe.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 overflow-hidden">
                <img
                  src="/free-shipping.png"
                  alt="Free Shipping"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Free Shipping
              </h3>
              <p className="text-sm text-gray-500">
                Free delivery on all orders across Pakistan.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 overflow-hidden">
                <img
                  src="/easy-return.png"
                  alt="Easy Returns"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-500">
                Not satisfied? Return within 7 days, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to start shopping?
        </h2>
        <p className="text-gray-500 mb-6">
          Create a free account and explore 30+ products.
        </p>
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
      </section>

    </div>
  );
}