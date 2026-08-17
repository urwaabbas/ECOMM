"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";
import AdminChatBell from "@/components/admin/AdminChatBell";
import AdminSearch from "@/components/admin/AdminSearch";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  product: {
    _id: string;
    title: string;
    images: string[];
  };
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [filtered, setFiltered] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      if ((session?.user as any)?.role !== "admin") {
        router.push("/");
        return;
      }
      fetchReviews();
    }
  }, [session, status, router]);

  useEffect(() => {
    let result = [...reviews];
    if (ratingFilter !== "all") {
      result = result.filter((r) => r.rating === ratingFilter);
    }
    if (productSearch.trim()) {
      result = result.filter((r) =>
        r.product?.title?.toLowerCase().includes(productSearch.toLowerCase())
      );
    }
    setFiltered(result);
  }, [reviews, ratingFilter, productSearch]);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setFiltered(data.reviews);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    setDeleteSubmitting(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const ratingCounts = [1, 2, 3, 4, 5].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <AdminSearch />
        <div className="flex items-center gap-4">
          <AdminNotificationBell />
          <AdminChatBell />
          <div className="h-6 w-[1px] bg-gray-200"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="w-9 h-9 bg-[#2563EB]/10 text-[#2563EB] font-bold rounded-full flex items-center justify-center text-sm border border-[#2563EB]/20">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-none">{session?.user?.name || "Admin"}</p>
              <p className="text-xs text-gray-500 mt-1">Store Administrator</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-8 max-w-[1600px] w-full mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Reviews Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {reviews.length} total reviews across all products
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {ratingCounts.map(({ rating, count }) => (
            <button
              key={rating}
              onClick={() => setRatingFilter(ratingFilter === rating ? "all" : rating)}
              className={`bg-white border rounded-2xl p-4 text-center shadow-xs transition hover:border-yellow-300 ${
                ratingFilter === rating ? "border-yellow-400 bg-yellow-50" : "border-gray-200/80"
              }`}
            >
              <div className="flex justify-center mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-sm ${s <= rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                ))}
              </div>
              <p className="text-2xl font-black text-gray-900">{count}</p>
              <p className="text-xs text-gray-400 mt-0.5">{rating} star{rating > 1 ? "s" : ""}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by product name..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={ratingFilter}
            onChange={(e) =>
              setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>
          {(ratingFilter !== "all" || productSearch) && (
            <button
              onClick={() => { setRatingFilter("all"); setProductSearch(""); }}
              className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2.5 border border-gray-200 rounded-xl"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Reviews Table */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              All Reviews
            </h2>
            <span className="text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
              {filtered.length} results
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left bg-gray-50/50">
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Reviewer</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  filtered.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            {review.product?.images?.[0] ? (
                              <img
                                src={review.product.images[0]}
                                alt={review.product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Img</div>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-gray-900 max-w-[140px] truncate">
                            {review.product?.title || "Deleted Product"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{review.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StarDisplay rating={review.rating} />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-500 max-w-[200px] truncate">
                          {review.comment || <span className="italic text-gray-300">No comment</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {deleteConfirmId === review._id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Sure?</span>
                            <button
                              onClick={() => handleDelete(review._id)}
                              disabled={deleteSubmitting}
                              className="text-xs text-white bg-red-500 hover:bg-red-600 font-semibold px-3 py-1 rounded-lg disabled:opacity-50"
                            >
                              {deleteSubmitting ? "..." : "Yes"}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1 border border-gray-200 rounded-lg"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(review._id)}
                            className="text-xs text-red-500 hover:text-red-600 font-semibold border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}