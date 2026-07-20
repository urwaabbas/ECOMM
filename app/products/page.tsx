import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";

export default function ProductsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Browse Products
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sort, filter, and explore our complete product catalog.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
        <ProductGrid />
      </div>
    </div>
  );
}
