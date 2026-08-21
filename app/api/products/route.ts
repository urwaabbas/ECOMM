import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getProductImageUrl } from "@/lib/product-image";

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
          _id:
            typeof product.category === "string"
              ? product.category
              : "",
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

    const categories = searchParams
      .getAll("category")
      .map((value) => value.trim())
      .filter(Boolean);

    const subcategories = searchParams
      .getAll("subcategory")
      .map((value) => value.trim())
      .filter(Boolean);

    const featured = searchParams.get("featured");
    const sale = searchParams.get("sale");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search")?.trim();

    const requestedPage = parseInt(
      searchParams.get("page") || "1",
      10,
    );

    const page =
      Number.isNaN(requestedPage) || requestedPage < 1
        ? 1
        : requestedPage;

    const limit = 12;
    const skip = (page - 1) * limit;

    await dbConnect();

    const queryFilter: Record<string, any> = {};

    /*
     * MULTIPLE CATEGORY FILTER
     *
     * Supports:
     * ?category=Men&category=Women
     *
     * and ObjectId category values too.
     */
    if (categories.length > 0) {
      const objectIdCategories: mongoose.Types.ObjectId[] = [];
      const categoryNames: string[] = [];

      categories.forEach((category) => {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);

        if (isObjectId) {
          objectIdCategories.push(
            new mongoose.Types.ObjectId(category),
          );
        } else {
          categoryNames.push(category);
        }
      });

      let categoryIds: mongoose.Types.ObjectId[] = [
        ...objectIdCategories,
      ];

      if (categoryNames.length > 0) {
        const categoryConditions = categoryNames.flatMap(
          (categoryName) => [
            {
              name: {
                $regex: `^${escapeRegex(categoryName)}$`,
                $options: "i",
              },
            },
            {
              slug: categoryName
                .toLowerCase()
                .replace(/\s+/g, "-"),
            },
          ],
        );

        const categoryDocs = (await Category.find({
          $or: categoryConditions,
        })
          .select("_id")
          .lean()) as {
          _id: mongoose.Types.ObjectId;
        }[];

        categoryIds = [
          ...categoryIds,
          ...categoryDocs.map((category) => category._id),
        ];
      }

      queryFilter.category = {
        $in: categoryIds,
      };
    }

    /*
     * MULTIPLE PRODUCT TYPE / SUBCATEGORY FILTER
     *
     * Supports:
     * ?subcategory=Jackets&subcategory=Jeans
     */
    if (subcategories.length > 0) {
      queryFilter.subcategory = {
        $in: subcategories.map(
          (subcategory) =>
            new RegExp(
              `^${escapeRegex(subcategory)}$`,
              "i",
            ),
        ),
      };
    }

    /*
     * FEATURED FILTER
     */
    if (featured === "true") {
      queryFilter.isFeatured = true;
    }

    /*
     * SALE FILTER
     */
    if (sale === "true") {
      queryFilter.discountPrice = {
        $ne: null,
        $gt: 0,
      };

      queryFilter.$expr = {
        $lt: ["$discountPrice", "$price"],
      };
    }

    /*
     * SEARCH
     */
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

    const totalProducts =
      await Product.countDocuments(queryFilter);

    const totalPages = Math.ceil(
      totalProducts / limit,
    );

    let productCursor = Product.find(queryFilter)
      .populate("category", "name slug")
      .skip(skip)
      .limit(limit);

    if (sort === "price_asc") {
      productCursor = productCursor.sort({
        price: 1,
      });
    }

    if (sort === "price_desc") {
      productCursor = productCursor.sort({
        price: -1,
      });
    }

    const fetchedProducts =
      await productCursor.lean().exec();

    const products =
      fetchedProducts.map(normalizeProduct);

    return NextResponse.json(
      {
        success: true,
        products,
        totalProducts,
        totalPages,
        currentPage: page,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error(
      "Products API error:",
      error.message,
    );

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}