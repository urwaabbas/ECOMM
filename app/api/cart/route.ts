import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

function normalizeItem(item: any) {
  return {
    productId: item.productId?.toString?.() ?? item.productId,
    title: item.title,
    price: Number(item.price ?? 0),
    discountPrice: item.discountPrice ?? null,
    quantity: Number(item.quantity ?? 1),
    image: item.image ?? "",
  };
}

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
    const cartDocument = await Cart.findOne({ user: userId }).lean();
    const cart = cartDocument as any | null;

    return NextResponse.json({
      success: true,
      cart: cart
        ? { ...cart, items: (cart.items || []).map(normalizeItem) }
        : { items: [] },
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
    const { productId, quantity = 1 } = body;

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

    const safeQuantity = Math.max(1, Number(quantity) || 1);
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item: any) => item.productId.toString() === productId,
    );
    if (existingItem) {
      existingItem.quantity += safeQuantity;
    } else {
      cart.items.push({
        productId,
        title: product.title,
        price: Number(product.price ?? 0),
        discountPrice: product.discountPrice ?? null,
        quantity: safeQuantity,
        image:
          Array.isArray(product.images) && product.images[0]
            ? product.images[0]
            : "",
      });
    }

    await cart.save();
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json({ success: true, cart: { items: [] } });
    }

    const item = cart.items.find(
      (entry: any) => entry.productId.toString() === productId,
    );
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 },
      );
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (entry: any) => entry.productId.toString() !== productId,
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    return NextResponse.json({ success: true, cart });
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
    const body = await request.text();
    const clearAll = body ? JSON.parse(body).clearAll === true : false;

    await dbConnect();
    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json({ success: true, cart: { items: [] } });
    }

    if (clearAll) {
      cart.items = [];
    } else if (productId) {
      cart.items = cart.items.filter(
        (entry: any) => entry.productId.toString() !== productId,
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    await cart.save();
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
