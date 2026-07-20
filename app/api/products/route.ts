// app/api/products/route.ts
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

    let products: any[] = [];

    const sortMapping: Record<string, 1 | -1> = {
      price_asc: 1,
      price_desc: -1,
      "low-to-high": 1,
      "high-to-low": -1,
    };

    try {
      await dbConnect();

      let queryFilter: Record<string, any> = {};
      let useCategoryFilterById = false;
      if (category && category !== "All") {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);
        if (isObjectId) {
          queryFilter.category = category;
          useCategoryFilterById = true;
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
      products = fetchedProducts.map(normalizeProduct);

      if (category && category !== "All" && !useCategoryFilterById) {
        const normalizedCategory = category.toLowerCase();
        products = products.filter(
          (p) =>
            p.category?.slug?.toLowerCase() === normalizedCategory ||
            p.category?.name?.toLowerCase() === normalizedCategory,
        );
      }
    } catch (dbError) {
      console.warn("Falling back to seeded product data:", dbError);
      // Normalize seeded products and ensure categories have usable _id (use slug)
      products = initialProducts.map((product: any, i: number) => {
        const catName =
          typeof product.category === "string"
            ? product.category
            : (product.category?.name ?? "uncategorized");
        const slug =
          (product.category && product.category.slug) ||
          String(catName).toLowerCase().replace(/\s+/g, "-");

        const seeded = {
          ...product,
          _id: product._id?.toString?.() ?? `seed-${i}`,
          title: product.title ?? product.name,
          name: product.name,
          images: Array.isArray(product.images)
            ? product.images
            : product.image
              ? [product.image]
              : [],
          image: product.image,
          category: {
            _id: slug,
            name: catName,
            slug,
          },
        };

        return normalizeProduct(seeded);
      });

      // Apply server-side filtering on fallback data as well
      if (category && category !== "All") {
        products = products.filter(
          (p) => p.category?._id === category || p.category?.name === category,
        );
      }

      if (search) {
        const s = search.toLowerCase();
        products = products.filter((p) =>
          (p.title + " " + p.description).toLowerCase().includes(s),
        );
      }

      if (sortMapping[sort ?? ""] === 1) {
        products = products.sort((a, b) => a.price - b.price);
      } else if (sortMapping[sort ?? ""] === -1) {
        products = products.sort((a, b) => b.price - a.price);
      }
    }

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
