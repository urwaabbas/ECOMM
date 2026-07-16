import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-gray-50 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Discover the Ultimate <span className="text-indigo-600">Shopping</span> Experience
            </h1>
            <p className="mt-4 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Explore handpicked, premium products. Built with high security, seamless checkout mechanisms, and lightning-fast loading speeds.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 md:py-4 md:px-10 md:text-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
          <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md bg-white p-8 border border-gray-100">
              <div className="text-center">
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800">
                  Week 1 Complete! 🚀
                </span>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Framework Configured</h2>
                <p className="mt-2 text-sm text-gray-500">
                  NextAuth, MongoDB, responsive layouts, schemas, custom registration, and page authorization routing are fully established.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}