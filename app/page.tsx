import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-6">
            ✨ New Season Arrivals Are Live
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 max-w-3xl leading-tight">
            Elevate Your Daily Routine With Premium Essentials
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Discover a curated collection of fine goods crafted for function, longevity, and timeless aesthetic design. Enjoy lightning-fast delivery and safe checkouts.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              href="#"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Explore Products
            </Link>
            <Link
              href="#"
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-6 py-3.5 rounded-lg text-sm font-semibold shadow-xs transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid / Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Premium Quality</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Hand-selected, thoroughly inspected products sourced responsibly from premium makers around the globe.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Express Delivery</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Your package ships tracked within 24 hours. Safe, fast, and completely free on all qualified orders.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Secure Payments</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                We use industry-standard encrypted Stripe gateways to isolate and safeguard financial account data.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Promobanner Section */}
      <section className="bg-indigo-950 my-12 mx-4 sm:mx-8 lg:mx-12 rounded-2xl text-white overflow-hidden shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center sm:py-20 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="block">Ready to elevate your gear?</span>
            <span className="block text-indigo-300 text-2xl sm:text-3xl mt-2">Get 10% off your first checkout today.</span>
          </h2>
          <p className="mt-4 text-base text-indigo-100 max-w-lg mx-auto leading-relaxed">
            Create an account, verify your shipping details, and get immediate access to members-only pricing and seasonal drops.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center justify-center bg-white text-indigo-950 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-lg text-sm shadow transition"
          >
            Claim Discount Code
          </Link>
        </div>
      </section>
    </div>
  );
}