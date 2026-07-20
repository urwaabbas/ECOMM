"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ProductDetail {
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
  ratings?: {
    average: number;
    count: number;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product identifier is missing from the route.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (res.ok) {
          setProduct(data);
          setActiveImage(data.images?.[0] || "");
        } else {
          setError(data.error || "Unable to load product properties.");
        }
      } catch (err) {
        setError("Network failure communicating with server endpoints.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-2xl h-96 w-full"></div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-100 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-1/4"></div>
            <div className="h-24 bg-gray-100 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 inline-block max-w-md">
          <p className="font-semibold">{error || "Item was not found."}</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm font-bold text-indigo-600 underline"
          >
            Return to Store Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation links */}
      <nav className="text-xs font-semibold text-gray-500 mb-8 uppercase tracking-wider">
        <Link href="/products" className="hover:text-indigo-600 transition">
          Catalog
        </Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-gray-900">{product.category.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Grid Section: Product Gallery Display */}
        <div className="space-y-4">
          <div className="w-full h-[450px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-xs relative">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover transition"
            />
          </div>
          {/* Support thumbnail sliders for multi-image configurations */}
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border-2 transition ${
                  activeImage === img
                    ? "border-indigo-600 shadow-xs"
                    : "border-gray-100 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Grid Section: Product Meta Data and Actions */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
              {product.title}
            </h1>
            <p className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
              {product.category.name}
            </p>
          </div>

          {/* Pricing blocks */}
          <div className="flex items-baseline gap-3 py-4 border-y border-gray-100">
            <span className="text-3xl font-black text-gray-900">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.price}
              </span>
            )}
          </div>

          {/* Description Block */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Product Details
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Availability Badge updates */}
          <div>
            <span className="text-xs font-medium text-gray-500">
              Inventory Status:{" "}
            </span>
            {product.stock > 0 ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                In Stock ({product.stock} units left)
              </span>
            ) : (
              <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Purchase CTA buttons (Pre-wired for Week 3 State integration) */}
          <div className="pt-4 space-y-3">
            <button
              disabled={product.stock === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Add to Shopping Cart
            </button>
            <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 font-semibold py-3 rounded-xl shadow-xs transition">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
