import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";

function getProductId(request: NextRequest) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  return pathParts[pathParts.length - 1];
}

async function recalculateRating(productId: string) {
  const allReviews = await Review.find({ product: productId });
  const count = allReviews.length;
  const average = count > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;
  await Product.findByIdAndUpdate(productId, {
    "ratings.average": Math.round(average * 10) / 10,
    "ratings.count": count,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    await dbConnect();
    const productId = getProductId(request);
    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    await dbConnect();
    const productId = getProductId(request);

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to leave a review" },
        { status: 401 },
      );
    }

    const userId = (session.user as any)?.id ?? session.user?.email;

    let body: { rating?: number; comment?: string } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const existing = await Review.findOne({ product: productId, user: userId });
    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 },
      );
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment: comment?.trim() || "",
      name: session.user.name || "Customer",
    });

    await recalculateRating(productId);

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 },
      );
    }
    console.error("Post review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    await dbConnect();
    const productId = getProductId(request);

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 },
      );
    }

    const userId = (session.user as any)?.id ?? session.user?.email;

    let body: { reviewId?: string; rating?: number; comment?: string } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { reviewId, rating, comment } = body;

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.user.toString() !== userId.toString()) {
      return NextResponse.json(
        { error: "You can only edit your own reviews" },
        { status: 403 },
      );
    }

    review.rating = rating;
    review.comment = comment?.trim() || "";
    await review.save();

    await recalculateRating(productId);

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error("Edit review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    await dbConnect();
    const productId = getProductId(request);

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 },
      );
    }

    const userId = (session.user as any)?.id ?? session.user?.email;

    let body: { reviewId?: string } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { reviewId } = body;

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.user.toString() !== userId.toString()) {
      return NextResponse.json(
        { error: "You can only delete your own reviews" },
        { status: 403 },
      );
    }

    await Review.findByIdAndDelete(reviewId);
    await recalculateRating(productId);

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}