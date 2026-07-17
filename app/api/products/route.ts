// app/api/products/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { seedDatabase } from "@/lib/seed";

export async function GET(request: Request) {
  try {
    await dbConnect();

    // 🟢 AUTO-SEED CHECK: If database has zero products, populate it immediately!
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("⚠️ No products found. Initializing auto-seed script...");
      await seedDatabase();
    }

    // Parse incoming filter parameters from the URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "createdAt"; // default sorting
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Build the dynamic Mongoose match query object
    const query: any = {};

    // 1. Full-text search execution
    if (search) {
      query.$text = { $search: search };
    }

    // 2. Relational Category Slug filtering
    if (categorySlug) {
      const categoryObj = await Category.findOne({ slug: categorySlug.toLowerCase() });
      if (categoryObj) {
        query.category = categoryObj._id;
      } else {
        // If an invalid category slug is requested, return clean empty result set
        return NextResponse.json({ products: [], totalPages: 0, currentPage: page }, { status: 200 });
      }
    }

    // 3. Price range constraint configuration
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Determine sort ordering options
    let sortOptions: any = { createdAt: -1 };
    if (sort === "priceAsc") sortOptions = { price: 1 };
    if (sort === "priceDesc") sortOptions = { price: -1 };
    if (sort === "rating") sortOptions = { "ratings.average": -1 };

    // Calculate pagination skipping offsets
    const skip = (page - 1) * limit;

    // Fetch filtered products and total match metrics simultaneously
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug") // Joins category details cleanly
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Catalog fetching API Error:", error);
    return NextResponse.json({ error: "Failed to connect or fetch catalog listings" }, { status: 500 });
  }
}