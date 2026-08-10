import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
