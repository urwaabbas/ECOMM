// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { initialProducts } from "@/lib/seed";
import { getProductImageUrl } from "@/lib/product-image";

function normalizeProduct(product: any) {
  const imageCandidates = [
    ...(Array.isArray(product.images) ? product.images : []),
    product.image,
  ].filter(Boolean) as string[];

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
    category:
      typeof product.category === "object" && product.category !== null
        ? {
            name: product.category.name ?? "Uncategorized",
            slug: product.category.slug ?? "uncategorized",
          }
        : {
            name: product.category ?? "Uncategorized",
            slug:
              typeof product.category === "string"
                ? product.category.toLowerCase().replace(/\s+/g, "-")
                : "uncategorized",
          },
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID parameter is required" },
        { status: 400 },
      );
    }

    const product = await Product.findById(id)
      .populate("category", "name slug")
      .lean();

    if (!product) {
      const fallbackProduct = initialProducts.find(
        (item: any) => item.name === id || item.title === id,
      );
      if (fallbackProduct) {
        return NextResponse.json(normalizeProduct(fallbackProduct), {
          status: 200,
        });
      }

      return NextResponse.json(
        { error: "Product not found inside the catalog database" },
        { status: 404 },
      );
    }
    return NextResponse.json(normalizeProduct(product), { status: 200 });
  } catch (error: any) {
    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid product identification code structure" },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
