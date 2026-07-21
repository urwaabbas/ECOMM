import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = (session.user as any)?.id ?? session.user?.email;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User session is missing an identifier" },
        { status: 401 },
      );
    }

    await dbConnect();
    const wishlist = await Wishlist.findOne({ user: userId }).lean();

    return NextResponse.json({
      success: true,
      wishlist: wishlist ? wishlist : { items: [] },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const productDocument = await Product.findById(productId).lean();
    const product = productDocument as any;
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    const userId = (session.user as any)?.id ?? session.user?.email;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User session is missing an identifier" },
        { status: 401 },
      );
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const exists = wishlist.items.some(
      (item: any) => item.productId.toString() === productId,
    );
    if (!exists) {
      wishlist.items.push({
        productId,
        title: product.title,
        price: Number(product.price ?? 0),
        discountPrice: product.discountPrice ?? null,
        image:
          Array.isArray(product.images) && product.images[0]
            ? product.images[0]
            : "",
      });
    }

    await wishlist.save();
    return NextResponse.json({ success: true, wishlist });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    const userId = (session.user as any)?.id ?? session.user?.email;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User session is missing an identifier" },
        { status: 401 },
      );
    }

    await dbConnect();
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return NextResponse.json({ success: true, wishlist: { items: [] } });
    }

    wishlist.items = wishlist.items.filter(
      (item: any) => item.productId.toString() !== productId,
    );
    await wishlist.save();
    return NextResponse.json({ success: true, wishlist });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
