import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getProductImageUrl } from "@/lib/product-image";
import mongoose from "mongoose";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
    subcategory: product.subcategory ?? "",
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
    const subcategory = searchParams.get("subcategory")?.trim();
    const featured = searchParams.get("featured");
    const sale = searchParams.get("sale");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search")?.trim();

    const requestedPage = parseInt(searchParams.get("page") || "1", 10);
    const page =
      Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage;

    const limit = 12;
    const skip = (page - 1) * limit;

    await dbConnect();

    const sortMapping: Record<string, 1 | -1> = {
      price_asc: 1,
      price_desc: -1,
    };

    const queryFilter: Record<string, any> = {};

    if (category && category !== "All") {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);

      if (isObjectId) {
        queryFilter.category = category;
      } else {
        const categoryDoc = (await Category.findOne({
          $or: [
            {
              name: {
                $regex: `^${escapeRegex(category)}$`,
                $options: "i",
              },
            },
            {
              slug: category.toLowerCase(),
            },
          ],
        })
          .select("_id")
          .lean()) as { _id: mongoose.Types.ObjectId } | null;

        queryFilter.category = categoryDoc?._id ?? null;
      }
    }

    if (subcategory) {
      queryFilter.subcategory = {
        $regex: `^${escapeRegex(subcategory)}$`,
        $options: "i",
      };
    }

    if (featured === "true") {
      queryFilter.isFeatured = true;
    }

    if (sale === "true") {
      queryFilter.discountPrice = {
        $ne: null,
        $gt: 0,
      };

      queryFilter.$expr = {
        $lt: ["$discountPrice", "$price"],
      };
    }

    if (search) {
      queryFilter.$or = [
        {
          title: {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
        {
          description: {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
      ];
    }

    const totalProducts = await Product.countDocuments(queryFilter);

    const totalPages = Math.ceil(totalProducts / limit);

    let productCursor = Product.find(queryFilter)
      .populate("category", "name slug")
      .skip(skip)
      .limit(limit);

    const sortDirection = sortMapping[sort ?? ""];

    if (sortDirection) {
      productCursor = productCursor.sort({
        price: sortDirection,
      });
    }

    const fetchedProducts = await productCursor.lean().exec();

    const products = fetchedProducts.map(normalizeProduct);

    return NextResponse.json(
      {
        success: true,
        products,
        totalProducts,
        totalPages,
        currentPage: page,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Products API error:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
