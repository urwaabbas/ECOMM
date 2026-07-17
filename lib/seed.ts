// lib/seed.ts
import dbConnect from "./db";
import Category from "../models/Category";
import Product from "../models/Product";

const sampleCategories = [
  { name: "Electronics", slug: "electronics", description: "High-end devices, gadgets, and computers" },
  { name: "Apparel", slug: "apparel", description: "Minimalist clothing, footwear, and seasonal collections" },
  { name: "Accessories", slug: "accessories", description: "Timeless wallets, backpacks, and everyday carry gear" }
];

const sampleProducts = [
  {
    title: "Minimalist Leather Backpack",
    description: "Crafted from premium full-grain leather. Features a protective 15-inch laptop sleeve, water-resistant zippers, and ergonomic shoulder straps designed for maximum daily comfort.",
    price: 149.99,
    discountPrice: 129.99,
    categoryName: "Accessories", // Used temporarily to look up the assigned ObjectId during insertion
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"],
    stock: 24,
    isFeatured: true,
    ratings: { average: 4.8, count: 42 }
  },
  {
    title: "Ergonomic Mechanical Keyboard",
    description: "Hot-swappable mechanical switches with custom PBT keycaps. Full RGB backlighting control and premium aluminum frame with multi-device Bluetooth and 2.4Ghz connectivity.",
    price: 119.99,
    discountPrice: null,
    categoryName: "Electronics",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"],
    stock: 15,
    isFeatured: true,
    ratings: { average: 4.6, count: 18 }
  },
  {
    title: "Premium Heavyweight Hoodie",
    description: "Loopback French terry knit hoodie made from 100% organic cotton. Pre-shrunk, ultra-comfortable 450gsm drape tailored for modern layering.",
    price: 85.00,
    discountPrice: null,
    categoryName: "Apparel",
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80"],
    stock: 50,
    isFeatured: false,
    ratings: { average: 4.9, count: 65 }
  },
  {
    title: "Wireless Noise-Canceling Headphones",
    description: "Active ambient noise cancellation with studio-grade high fidelity audio drivers. Includes memory foam ear cups and a built-in battery delivering up to 40 hours of continuous playback.",
    price: 249.99,
    discountPrice: 199.99,
    categoryName: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"],
    stock: 8,
    isFeatured: true,
    ratings: { average: 4.7, count: 112 }
  },
  {
    title: "Classic Matte Slim Wallet",
    description: "RFID-blocking aerospace aluminum construction cardholder wrapped in premium leather trim. Holds up to 12 cards without stretching or adding bulk to your pocket.",
    price: 45.00,
    discountPrice: 39.99,
    categoryName: "Accessories",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80"],
    stock: 35,
    isFeatured: false,
    ratings: { average: 4.4, count: 29 }
  }
];

export async function seedDatabase() {
  try {
    console.log("⏳ Connecting to database for seeding...");
    await dbConnect();

    // 1. Wipe existing items to avoid duplicates during dev updates
    console.log("🧹 Clearing old products and categories...");
    await Product.deleteMany({});
    await Category.deleteMany({});

    // 2. Insert Categories
    console.log("🌱 Seeding Categories...");
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Successfully seeded ${createdCategories.length} categories!`);

    // Create a map to easily resolve Category ID by name strings
    const categoryMap: Record<string, string> = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = (cat._id as any).toString();
    });

    // 3. Map categories to products and insert
    console.log("🌱 Seeding Products...");
    const finalizedProducts = sampleProducts.map((prod) => {
      const categoryId = categoryMap[prod.categoryName];
      if (!categoryId) {
        throw new Error(`Category mapping failed for name: ${prod.categoryName}`);
      }

      // Destructure out categoryName and add relational category field
      const { categoryName, ...productData } = prod;
      return {
        ...productData,
        category: categoryId
      };
    });

    const createdProducts = await Product.insertMany(finalizedProducts);
    console.log(`✅ Successfully seeded ${createdProducts.length} relational items into the database!`);
    return { success: true, message: "Database seeded perfectly." };

  } catch (error) {
    console.error("❌ Seeding database aborted with an exception:", error);
    throw error;
  }
}