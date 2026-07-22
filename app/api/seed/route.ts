import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { initialProducts } from "@/lib/seed";

export async function GET() {
  try {
    await dbConnect();

    // ✅ Step 1 — Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("🗑️ Cleared existing products and categories");

    // ✅ Step 2 — Create unique categories from seed data
    const categoryNames = [
      ...new Set(initialProducts.map((p: any) => p.category)),
    ];

    const categoryDocs = await Category.insertMany(
      categoryNames.map((name) => ({
        name,
        slug: (name as string)
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/&/g, "and"),
      })),
    );
    console.log(`✅ Created ${categoryDocs.length} categories`);

    // ✅ Step 3 — Map category name to its _id
    const categoryMap = new Map(
      categoryDocs.map((cat: any) => [cat.name, cat._id]),
    );

    // ✅ Step 4 — Insert products with correct category references
    const productsToInsert = initialProducts.map((p: any) => ({
      title: p.name,
      description: p.description,
      price: p.price,
      discountPrice: null,
      images: [p.image],
      stock: p.stock,
      isFeatured: false,
      category: categoryMap.get(p.category),
      ratings: { average: 0, count: 0 },
    }));

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    return NextResponse.json(
      {
        message: "Database seeded successfully",
        categories: categoryDocs.length,
        products: insertedProducts.length,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ Seed error:", error.message);
    return NextResponse.json(
      { error: "Failed to seed database", details: error.message },
      { status: 500 },
    );
  }
}
