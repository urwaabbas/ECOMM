import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Cart from "@/models/Cart";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const cart = await Cart.findOne({ user: session.user.id });
    return NextResponse.json({ success: true, items: cart?.items || [] });
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
    const { productId, title, price, discountPrice, image, quantity = 1 } = body;

    if (!productId || !title || price === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [{ productId, title, price, discountPrice, image, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item: any) => item.productId.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, title, price, discountPrice, image, quantity });
      }
      await cart.save();
    }

    return NextResponse.json({ success: true, items: cart.items });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();
    if (!productId || quantity < 1) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    await dbConnect();
    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });
    }

    const item = cart.items.find(
      (item: any) => item.productId.toString() === productId
    );
    if (item) {
      item.quantity = quantity;
      await cart.save();
    }

    return NextResponse.json({ success: true, items: cart.items });
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

    const { productId, clearAll } = await request.json();
    await dbConnect();
    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });
    }

    if (clearAll) {
      cart.items = [];
    } else {
      cart.items = cart.items.filter(
        (item: any) => item.productId.toString() !== productId
      );
    }

    await cart.save();
    return NextResponse.json({ success: true, items: cart.items });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}