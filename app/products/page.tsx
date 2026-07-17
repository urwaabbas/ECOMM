"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ProductItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  stock: number;
  category: {
    name: string;
    slug: string;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ sort, limit: "12" });
      if (search) queryParams.append("search", search);
      if (category) queryParams.append("category", category);

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      
      {/* High-Contrast Interactive Search & Filter Utility Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-200 pb-6 mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">SHOP STORES</h1>
          <p className="text-xs text-gray-500 mt-0.5">Explore premium essentials and seasonal drops.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Text Query Field with Explicit Contrast Boundaries */}
          <div className="relative flex-1 md:flex-none min-w-[240px]">
            <input
              type="text"
              placeholder="Search by title, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
              className="w-full border-2 border-gray-300 text-sm text-gray-900 rounded-xl px-4 py-2 bg-white focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Explicit Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-2 border-gray-300 text-sm font-semibold text-gray-800 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition cursor-pointer"
          >
            <option value="">Filter by Category</option>
            <option value="electronics">Electronics</option>
            <option value="apparel">Apparel</option>
            <option value="accessories">Accessories</option>
          </select>

          {/* Sort Metrics Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border-2 border-gray-300 text-sm font-semibold text-gray-800 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition cursor-pointer"
          >
            <option value="createdAt">Sort: New Arrivals</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Listings Collection View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-100 border border-gray-200 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-sm font-medium text-gray-500 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
          No matching catalog assets located under those filter settings.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((item) => (
            <Link 
              href={`/products/${item._id}`} 
              key={item._id}
              className="group flex flex-col justify-between p-4 border border-gray-200 rounded-2xl bg-white hover:border-black hover:shadow-xs transition-all duration-200"
            >
              <div>
                {/* Visual Thumbnail Frame with High-Contrast Text Tags */}
                <div className="w-full h-56 bg-gray-50 rounded-xl overflow-hidden mb-4 relative border border-gray-100">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                  />
                  {/* High-Contrast, High-Visibility Category Label */}
                  <span className="absolute bottom-2.5 right-2.5 text-[10px] font-extrabold bg-gray-900 text-white px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {item.category.name}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Price Row Block */}
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
                <span className="text-sm font-black text-gray-900">
                  ${item.discountPrice || item.price}
                </span>
                <span className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 group-hover:underline">
                  View Product →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}