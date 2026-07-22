// app/api/products/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { getProductImageUrl } from "@/lib/product-image";
import "@/models/Category";

function normalizeProduct(product: any) {
  const imageCandidates = [
    ...(Array.isArray(product.images) ? product.images : []),
    product.image,
  ].filter(Boolean) as string[];

  const category =
    typeof product.category === "object" && product.category !== null
      ? {
          _id: product.category._id?.toString?.() ?? "",
          name: product.category.name ?? "Uncategorized",
          slug: product.category.slug ?? "uncategorized",
        }
      : {
          _id: typeof product.category === "string" ? product.category : "",
          name: "Uncategorized",
          slug: "uncategorized",
        };

  return {
    _id: product._id?.toString?.() ?? "",
    title: product.title ?? product.name ?? "Untitled Product",
    description: product.description ?? "",
    price: Number(product.price ?? 0),
    discountPrice: product.discountPrice ?? null,
    images:
      imageCandidates.length > 0
        ? imageCandidates
        : [getProductImageUrl(product)],
    stock: Number(product.stock ?? 0),
    isFeatured: Boolean(product.isFeatured),
    ratings: {
      average: Number(product.ratings?.average ?? 0),
      count: Number(product.ratings?.count ?? 0),
    },
    category,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search")?.trim();

    await dbConnect();
    console.log("✅ DB connected, fetching from MongoDB");

    const sortMapping: Record<string, 1 | -1> = {
      price_asc: 1,
      price_desc: -1,
      "low-to-high": 1,
      "high-to-low": -1,
    };

    let queryFilter: Record<string, any> = {};

    if (category && category !== "All") {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);
      if (isObjectId) {
        queryFilter.category = category;
      }
    }

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let productCursor = Product.find(queryFilter).populate(
      "category",
      "name slug",
    );

    const sortDirection = sortMapping[sort ?? ""];
    if (sortDirection) {
      productCursor = productCursor.sort({ price: sortDirection });
    }

    const fetchedProducts = await productCursor.lean().exec();
    let products = fetchedProducts.map(normalizeProduct);

    // Handle non-ObjectId category filter (by name or slug)
    if (category && category !== "All" && !/^[0-9a-fA-F]{24}$/.test(category)) {
      const normalizedCategory = category.toLowerCase();
      products = products.filter(
        (p) =>
          p.category?.slug?.toLowerCase() === normalizedCategory ||
          p.category?.name?.toLowerCase() === normalizedCategory,
      );
    }

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Products API error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
