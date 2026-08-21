"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  isFeatured?: boolean;
  category: {
    name: string;
    slug: string;
  };
  ratings?: {
    average: number;
    count: number;
  };
}

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: string;
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (value: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={`text-2xl transition ${
            star <= (hovered || value) ? "text-yellow-400" : "text-gray-300"
          } ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data: session } = useSession();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (res.ok) {
          setProduct(data);
          setActiveImage(data.images?.[0] || "");
        } else {
          setError(data.error || "Unable to load product.");
        }
      } catch {
        setError("Network failure. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        const data = await res.json();

        if (res.ok) {
          setReviews(data);
        }
      } catch {
        console.error("Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setReviewError(null);
    setReviewSuccess(null);

    if (rating === 0) {
      setReviewError("Please select a star rating.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviewSuccess("Review submitted successfully!");
        setRating(0);
        setComment("");

        setReviews((prev) => [data, ...prev]);

        setProduct((prev) =>
          prev
            ? {
                ...prev,
                ratings: {
                  average:
                    Math.round(
                      (((prev.ratings?.average || 0) *
                        (prev.ratings?.count || 0) +
                        rating) /
                        ((prev.ratings?.count || 0) + 1)) *
                        10,
                    ) / 10,
                  count: (prev.ratings?.count || 0) + 1,
                },
              }
            : prev,
        );
      } else {
        setReviewError(data.error || "Failed to submit review.");
      }
    } catch {
      setReviewError("Failed to connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (reviewId: string) => {
    if (editRating === 0) return;

    setEditSubmitting(true);

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          rating: editRating,
          comment: editComment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviews((prev) =>
          prev.map((review) =>
            review._id === reviewId
              ? {
                  ...review,
                  rating: editRating,
                  comment: editComment,
                }
              : review,
          ),
        );

        setEditingId(null);
      } else {
        setReviewError(data.error || "Failed to update review.");
      }
    } catch {
      setReviewError("Failed to connect to server.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    setDeleteSubmitting(true);

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviews((prev) => prev.filter((review) => review._id !== reviewId));

        setDeleteConfirmId(null);

        setProduct((prev) =>
          prev
            ? {
                ...prev,
                ratings: {
                  average:
                    prev.ratings?.count === 1 ? 0 : prev.ratings?.average || 0,
                  count: Math.max((prev.ratings?.count || 1) - 1, 0),
                },
              }
            : prev,
        );
      } else {
        setReviewError(data.error || "Failed to delete review.");
      }
    } catch {
      setReviewError("Failed to connect to server.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 h-16 rounded-2xl bg-gray-100" />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="h-[620px] rounded-3xl bg-gray-100" />

            <div className="space-y-6 pt-8">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-12 w-4/5 rounded bg-gray-200" />
              <div className="h-5 w-40 rounded bg-gray-200" />
              <div className="h-12 w-56 rounded bg-gray-200" />
              <div className="h-24 w-full rounded bg-gray-200" />
              <div className="h-14 w-full rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>

          <p className="mt-3 text-sm text-red-600">
            {error || "Item was not found."}
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : null;

  const ratingAverage = product.ratings?.average || 0;
  const ratingCount = product.ratings?.count || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* PRODUCT NAVIGATION */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-900">
              {product.title}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href="#highlights"
              className="hidden rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 sm:inline-flex"
            >
              Explore
            </a>

            <a
              href="#buy"
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Buy
            </a>
          </div>
        </div>
      </div>

      {/* BREADCRUMB */}

      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-400">
          <Link href="/products" className="transition hover:text-indigo-600">
            Catalog
          </Link>

          <span>/</span>

          <Link
            href={`/products?category=${encodeURIComponent(
              product.category.name,
            )}`}
            className="transition hover:text-indigo-600"
          >
            {product.category.name}
          </Link>

          <span>/</span>

          <span className="max-w-[240px] truncate text-gray-600">
            {product.title}
          </span>
        </nav>
      </div>

      {/* MAIN PRODUCT */}

      <section
        id="buy"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* IMAGE */}

          <div>
            <div className="aspect-[4/5] w-full">
              <img
                src={activeImage}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />

              {product.isFeatured && (
                <span className="absolute left-5 top-5 rounded-full bg-gray-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Featured
                </span>
              )}

              {discountPercent !== null && (
                <span className="absolute right-5 top-5 rounded-full bg-red-500 px-3 py-1.5 text-[10px] font-bold text-white">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 bg-[#f5f5f7] transition ${
                      activeImage === image
                        ? "border-indigo-600"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PURCHASE PANEL */}

          <div className="flex flex-col justify-center lg:py-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
              {product.category.name}
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl">
              {product.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {ratingCount > 0 ? (
                <>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= Math.round(ratingAverage)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    {ratingAverage.toFixed(1)}
                  </span>

                  <a
                    href="#reviews"
                    className="text-sm text-gray-500 transition hover:text-indigo-600"
                  >
                    {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
                  </a>
                </>
              ) : (
                <a
                  href="#reviews"
                  className="text-sm text-gray-500 transition hover:text-indigo-600"
                >
                  No reviews yet
                </a>
              )}
            </div>

            <div className="mt-8 border-y border-gray-200 py-7">
              <div className="flex flex-wrap items-end gap-3">
                <span
                  className="text-4xl font-bold tracking-tight"
                  style={{
                    color: "#111827",
                    WebkitTextFillColor: "#111827",
                    opacity: 1,
                  }}
                >
                  {formatPricePKR(product.discountPrice || product.price)}
                </span>

                {discountPercent !== null && (
                  <span className="mb-1 text-sm font-bold text-red-600">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {product.discountPrice && (
                <p className="mt-2 text-sm text-gray-500">
                  List Price:{" "}
                  <span className="line-through">
                    {formatPricePKR(product.price)}
                  </span>
                </p>
              )}
            </div>

            <div className="mt-7">
              <p className="text-base leading-7 text-gray-600">
                {product.description}
              </p>
            </div>

            <div className="mt-7">
              {product.stock > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <div>
                    <p className="text-sm font-semibold text-emerald-700">
                      In Stock
                    </p>

                    <p className="text-xs text-gray-500">
                      {product.stock} units currently available
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                  <p className="text-sm font-semibold text-red-600">
                    Currently Out of Stock
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8">
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

            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-gray-200 pt-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  Secure checkout
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Protected payment processing at checkout.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  Easy returns
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Eligible purchases can be returned within 7 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}

      <section
        id="highlights"
        className="border-y border-gray-200 bg-[#f5f5f7]"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Product Overview
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
              Get the highlights.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 7h18M5 7l1 12h12l1-12M9 11v4m6-4v4"
                  />
                </svg>
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {product.category.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Part of our curated {product.category.name.toLowerCase()}{" "}
                collection.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {product.stock > 0 ? "Ready to order" : "Unavailable"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {product.stock > 0
                  ? `${product.stock} units are currently available.`
                  : "This product is currently out of stock."}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 8c-2.761 0-5 1.343-5 3s2.239 3 5 3 5 1.343 5 3-2.239 3-5 3m0-12V5m0 15v-3"
                  />
                </svg>
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {discountPercent !== null
                  ? `${discountPercent}% savings`
                  : "Straightforward pricing"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {discountPercent !== null
                  ? "A reduced price is currently available on this product."
                  : "Clear pricing with no unnecessary distractions."}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
                  />
                </svg>
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {ratingCount > 0
                  ? `${ratingAverage.toFixed(1)} out of 5`
                  : "Customer reviews"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {ratingCount > 0
                  ? `Based on ${ratingCount} customer ${
                      ratingCount === 1 ? "review" : "reviews"
                    }.`
                  : "Be the first customer to share your experience."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT DETAILS */}

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Product Details
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-center text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl">
            Designed for the way you shop.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-8 text-gray-500">
            {product.description}
          </p>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-3xl bg-gray-50 p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Category
              </p>

              <p className="mt-3 text-lg font-bold text-gray-900">
                {product.category.name}
              </p>
            </div>

            <div className="rounded-3xl bg-gray-50 p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Availability
              </p>

              <p className="mt-3 text-lg font-bold text-gray-900">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>
            </div>

            <div className="rounded-3xl bg-gray-50 p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Customer Rating
              </p>

              <p className="mt-3 text-lg font-bold text-gray-900">
                {ratingCount > 0
                  ? `${ratingAverage.toFixed(1)} / 5`
                  : "Not rated yet"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}

      <section id="reviews" className="border-t border-gray-200 bg-[#f5f5f7]">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Customer Feedback
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Customer Reviews
              </h2>
            </div>

            {ratingCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xl text-yellow-400">★</span>

                <span className="text-xl font-bold text-gray-900">
                  {ratingAverage.toFixed(1)}
                </span>

                <span className="text-sm text-gray-500">
                  / 5 · {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}
          </div>

          {session ? (
            <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900">
                Write a Review
              </h3>

              {reviewError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {reviewError}
                </div>
              )}

              {reviewSuccess && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {reviewSuccess}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Your Rating
                  </label>

                  <StarRating value={rating} onChange={setRating} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Comment
                  </label>

                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Share your experience with this product..."
                    maxLength={500}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {comment.length}/500
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          ) : (
            <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">
                You must be logged in to leave a review.
              </p>

              <Link
                href={`/login?callbackUrl=${encodeURIComponent(
                  `/products/${product._id}`,
                )}`}
                className="mt-4 inline-flex rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                Sign in to review
              </Link>
            </div>
          )}

          {reviewsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6"
                >
                  <div className="mb-4 h-4 w-28 rounded bg-gray-200" />
                  <div className="mb-2 h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-3/4 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-14 text-center">
              <p className="text-sm text-gray-500">
                No reviews yet. Be the first to review this product.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const isOwner =
                  session &&
                  (session.user as any)?.id === review.user?.toString();

                const isEditing = editingId === review._id;

                const isConfirmingDelete = deleteConfirmId === review._id;

                return (
                  <div
                    key={review._id}
                    className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                          {review.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {review.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-PK",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      {isOwner && !isEditing && (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(review._id);
                              setEditRating(review.rating);
                              setEditComment(review.comment);
                              setDeleteConfirmId(null);
                            }}
                            className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
                          >
                            Edit
                          </button>

                          {!isConfirmingDelete ? (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(review._id)}
                              className="text-xs font-semibold text-red-500 transition hover:text-red-700"
                            >
                              Delete
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                Delete?
                              </span>

                              <button
                                type="button"
                                onClick={() => handleDelete(review._id)}
                                disabled={deleteSubmitting}
                                className="text-xs font-bold text-red-600 disabled:opacity-50"
                              >
                                {deleteSubmitting ? "..." : "Yes"}
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-xs text-gray-400"
                              >
                                No
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-5 space-y-4">
                        <StarRating
                          value={editRating}
                          onChange={setEditRating}
                        />

                        <textarea
                          value={editComment}
                          onChange={(event) =>
                            setEditComment(event.target.value)
                          }
                          maxLength={500}
                          rows={4}
                          className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditSubmit(review._id)}
                            disabled={editSubmitting}
                            className="rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50"
                          >
                            {editSubmitting ? "Saving..." : "Save"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5">
                        <StarRating value={review.rating} />

                        {review.comment && (
                          <p className="mt-3 text-sm leading-7 text-gray-600">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
