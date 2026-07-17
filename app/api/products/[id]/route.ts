// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // Resolve the dynamic route ID parameter properly in Next.js 15+
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const product = await Product.findById(id).populate("category", "name slug");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error("❌ Single product API Error:", error);
    return NextResponse.json({ error: "Invalid product identifier or database failure" }, { status: 500 });
  }
}