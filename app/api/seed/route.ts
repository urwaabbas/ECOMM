import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { initialProducts } from "@/lib/seed";

export async function GET() {
  try {
    await dbConnect();

    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log("Cleared existing products and categories");

    const categoryNames = [
      ...new Set(initialProducts.map((product) => product.category)),
    ];

    const categoryDocs = await Category.insertMany(
      categoryNames.map((name) => ({
        name,
        slug: name
          .toLowerCase()
          .replace(/&/g, "and")
          .replace(/\s+/g, "-"),
      })),
    );

    console.log(`Created ${categoryDocs.length} categories`);

    const categoryMap = new Map(
      categoryDocs.map((category) => [
        category.name,
        category._id,
      ]),
    );

    const productsToInsert = initialProducts.map((product) => ({
      title: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice ?? null,
      category: categoryMap.get(product.category),
      subcategory: product.subcategory ?? "",
      images: [product.image],
      stock: product.stock,
      isFeatured: product.isFeatured ?? false,
      ratings: {
        average: 0,
        count: 0,
      },
    }));

    const insertedProducts =
      await Product.insertMany(productsToInsert);

    console.log(
      `Inserted ${insertedProducts.length} products`,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Database seeded successfully",
        categories: categoryDocs.length,
        products: insertedProducts.length,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Seed error:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed database",
        details: error.message,
      },
      { status: 500 },
    );
  }
}