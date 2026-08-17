import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const reviews = await Review.find()
      .populate("product", "title images")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error("Admin fetch reviews error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

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

    const productId = review.product.toString();
    await Review.findByIdAndDelete(reviewId);

    const allReviews = await Review.find({ product: productId });
    const count = allReviews.length;
    const average = count > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;

    await Product.findByIdAndUpdate(productId, {
      "ratings.average": Math.round(average * 10) / 10,
      "ratings.count": count,
    });

    return NextResponse.json({ success: true, message: "Review deleted" }, { status: 200 });
  } catch (error) {
    console.error("Admin delete review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}