"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPricePKR } from "@/lib/utilis";
import ShoppingActions from "@/components/ShoppingActions";

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
          setError(data.error || "Unable to load product.");
        }
      } catch (err) {
        setError("Network failure. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-200 rounded-2xl h-[450px] w-full"></div>
            <div className="space-y-6 pt-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-sm text-red-600 mb-6">{error || "Item was not found."}</p>
          <Link
            href="/products"
            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-8">
          <Link href="/products" className="hover:text-indigo-600 transition">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-gray-500">{product.category.name}</span>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Left — Image Gallery */}
            <div className="bg-gray-50 p-6 border-r border-gray-100">
              {/* Main Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white border border-gray-100">
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        activeImage === img
                          ? "border-indigo-500 shadow-md"
                          : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Product Info */}
            <div className="p-8 flex flex-col gap-6">

              {/* Title + Category */}
              <div>
                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                  {product.category.name}
                </span>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">
                  {product.title}
                </h1>

                {/* Ratings */}
                {product.ratings && product.ratings.count > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-bold text-gray-700">
                      {product.ratings.average}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({product.ratings.count} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-4 border-y border-gray-100">
                <span className="text-3xl font-black text-gray-900">
                  {formatPricePKR(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPricePKR(product.price)}
                  </span>
                )}
                {product.discountPrice && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {Math.round(
                      ((product.price - product.discountPrice) / product.price) * 100
                    )}% OFF
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Product Details
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  Availability:
                </span>
                {product.stock > 0 ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    ✓ In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Shopping Actions */}
              <div className="pt-2">
                <ShoppingActions
                  product={{
                    _id: product._id,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    discountPrice: product.discountPrice,
                    images: product.images,
                    stock: product.stock,
                    category: product.category,
                  }}
                />
              </div>

              {/* Back link */}
              <Link
                href="/products"
                className="text-xs text-gray-400 hover:text-indigo-600 transition text-center"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}