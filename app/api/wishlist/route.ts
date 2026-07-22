import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Wishlist from "@/models/Wishlist";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const wishlist = await Wishlist.findOne({ user: session.user.id });
    return NextResponse.json({ success: true, items: wishlist?.items || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, title, price, discountPrice, image } = body;

    if (!productId || !title || price === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    let wishlist = await Wishlist.findOne({ user: session.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: session.user.id,
        items: [{ productId, title, price, discountPrice, image }],
      });
    } else {
      const exists = wishlist.items.some(
        (item: any) => item.productId.toString() === productId
      );
      if (!exists) {
        wishlist.items.push({ productId, title, price, discountPrice, image });
        await wishlist.save();
      }
    }

    return NextResponse.json({ success: true, items: wishlist.items });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    await dbConnect();
    const wishlist = await Wishlist.findOne({ user: session.user.id });
    if (!wishlist) {
      return NextResponse.json({ success: false, error: "Wishlist not found" }, { status: 404 });
    }

    wishlist.items = wishlist.items.filter(
      (item: any) => item.productId.toString() !== productId
    );
    await wishlist.save();

    return NextResponse.json({ success: true, items: wishlist.items });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}