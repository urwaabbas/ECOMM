import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import HomeBottomSection from "@/components/HomeBottomSection";
import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import CustomerReviews from "@/components/CustomerReviews";
import HeroSection from "@/components/HeroButtons";

const categories = [
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    desc: "Gadgets & devices",
  },
  {
    name: "Apparel",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop",
    desc: "Clothing & accessories",
  },
  {
    name: "Home & Living",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
    desc: "Home essentials",
  },
  {
    name: "Fitness",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    desc: "Sports & fitness",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      <HeroSection />

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

      <FeaturedProductsCarousel />

      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Haanli Bazaar?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 overflow-hidden">
                <img src="/secure-img.png" alt="Secure Payments" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Secure Payments</h3>
              <p className="text-sm text-gray-500">
                Powered by Stripe — your payment details are always safe.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 overflow-hidden">
                <img src="/free-shipping.png" alt="Free Shipping" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-500">
                Free delivery on all orders across Pakistan.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 overflow-hidden">
                <img src="/easy-return.png" alt="Easy Returns" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-500">
                Not satisfied? Return within 7 days, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CustomerReviews />

      <HomeBottomSection />

      
    </div>
  );
}