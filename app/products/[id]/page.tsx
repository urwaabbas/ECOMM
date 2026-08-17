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
  category: { name: string; slug: string };
  ratings?: { average: number; count: number };
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
  onChange?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
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
        if (res.ok) setReviews(data);
      } catch {
        console.error("Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
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
                        10
                    ) / 10,
                  count: (prev.ratings?.count || 0) + 1,
                },
              }
            : prev
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, rating: editRating, comment: editComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId
              ? { ...r, rating: editRating, comment: editComment }
              : r
          )
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        setDeleteConfirmId(null);
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                ratings: {
                  average: prev.ratings?.count === 1 ? 0 : prev.ratings?.average || 0,
                  count: Math.max((prev.ratings?.count || 1) - 1, 0),
                },
              }
            : prev
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-sm text-red-600 mb-6">{error || "Item was not found."}</p>
          <Link href="/products" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-8">
          <Link href="/products" className="hover:text-indigo-600 transition">Catalog</Link>
          <span>/</span>
          <span className="text-gray-500">{product.category.name}</span>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="bg-gray-50 p-6 border-r border-gray-100">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white border border-gray-100">
                <img src={activeImage} alt={product.title} className="w-full h-full object-cover" />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        activeImage === img ? "border-indigo-500 shadow-md" : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`${product.title} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col gap-6">
              <div>
                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                  {product.category.name}
                </span>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">{product.title}</h1>
                {product.ratings && product.ratings.count > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-bold text-gray-700">{product.ratings.average}</span>
                    <span className="text-xs text-gray-400">({product.ratings.count} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-3 py-4 border-y border-gray-100">
                <span className="text-3xl font-black text-gray-900">
                  {formatPricePKR(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-gray-400 line-through">{formatPricePKR(product.price)}</span>
                )}
                {product.discountPrice && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Details</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    ✓ In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">Out of Stock</span>
                )}
              </div>

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

              <Link href="/products" className="text-xs text-gray-400 hover:text-indigo-600 transition text-center">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-gray-900">Customer Reviews</h2>
            {product.ratings && product.ratings.count > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-xl font-black text-gray-900">{product.ratings.average}</span>
                <span className="text-sm text-gray-400">/ 5 · {product.ratings.count} reviews</span>
              </div>
            )}
          </div>

          {session ? (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Write a Review</h3>
              {reviewError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                  {reviewError}
                </div>
              )}
              {reviewSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg mb-4">
                  {reviewSuccess}
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Your Rating</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Comment (optional)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    maxLength={500}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-3">You must be logged in to leave a review.</p>
              <Link href="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Sign in to review →
              </Link>
            </div>
          )}

          {reviewsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border border-gray-100 rounded-xl p-5">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const isOwner = session && (session.user as any)?.id === review.user?.toString();
                const isEditing = editingId === review._id;
                const isConfirmingDelete = deleteConfirmId === review._id;

                return (
                  <div key={review._id} className="border border-gray-100 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{review.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {isOwner && !isEditing && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingId(review._id);
                                setEditRating(review.rating);
                                setEditComment(review.comment);
                                setDeleteConfirmId(null);
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              Edit
                            </button>
                            {!isConfirmingDelete ? (
                              <button
                                onClick={() => setDeleteConfirmId(review._id)}
                                className="text-xs text-red-500 hover:text-red-600 font-medium"
                              >
                                Delete
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Sure?</span>
                                <button
                                  onClick={() => handleDelete(review._id)}
                                  disabled={deleteSubmitting}
                                  className="text-xs text-red-600 font-bold hover:text-red-700 disabled:opacity-50"
                                >
                                  {deleteSubmitting ? "..." : "Yes"}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="text-xs text-gray-400 hover:text-gray-600"
                                >
                                  No
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="mt-3 space-y-3">
                        <StarRating value={editRating} onChange={setEditRating} />
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          maxLength={500}
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSubmit(review._id)}
                            disabled={editSubmitting}
                            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                          >
                            {editSubmitting ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs text-gray-400 hover:text-gray-600 px-4 py-1.5 border border-gray-200 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <StarRating value={review.rating} />
                        {review.comment && (
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}