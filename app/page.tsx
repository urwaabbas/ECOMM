import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-gray-900">
        Welcome to Haanli Bazaar
      </h1>
      <p className="mt-4 text-gray-500 max-w-md">
        Browse premium products across Electronics, Apparel, Home & Living, and Fitness.
      </p>
      <Link
        href="/products"
        className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Shop Now
      </Link>
    </div>
  );
}