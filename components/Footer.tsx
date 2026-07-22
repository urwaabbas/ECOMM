import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Top CTA Strip */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-black text-lg">Ready to start shopping?</h3>
            <p className="text-indigo-200 text-sm mt-1">Thousands of products. Free shipping. Always.</p>
          </div>
          <Link
            href="/products"
            className="shrink-0 bg-white text-indigo-600 font-bold text-sm px-6 py-3 rounded-lg hover:bg-indigo-50 transition shadow-md"
          >
            Browse Products →
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-white font-black text-xl uppercase tracking-wider mb-3">
              Haanli Bazaar
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your one-stop destination for premium products. Safe checkout, fast delivery, and curated quality.
            </p>
            <div className="flex gap-3">
              {["facebook", "twitter", "instagram"].map((s) => (
                <a key={s} href="#" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition text-xs font-bold text-gray-400 hover:text-white uppercase">
                  {s.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              {["All Products", "Electronics", "Apparel", "Home & Living", "Fitness"].map((item) => (
                <li key={item}>
                  <Link href="/products" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "Contact Support", "Privacy Policy", "Terms of Service", "Return Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Get exclusive deals, new arrivals, and style tips delivered weekly.
            </p>
            <div className="flex rounded-lg overflow-hidden border border-gray-700 focus-within:border-indigo-500 transition">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-gray-900 text-white text-sm px-3 py-2.5 focus:outline-none placeholder:text-gray-600"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 transition">
                →
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 mt-10 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { icon: "🔒", label: "Secure Checkout" },
            { icon: "🚚", label: "Free Shipping" },
            { icon: "↩️", label: "Easy Returns" },
            { icon: "⭐", label: "Top Rated" },
          ].map((badge) => (
            <div key={badge.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-xs font-semibold text-gray-400">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Haanli Bazaar. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400 transition">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition">Terms</a>
            <a href="#" className="hover:text-gray-400 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}