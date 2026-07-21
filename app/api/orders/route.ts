import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
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
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, orders });
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
    const { shipping = 0 } = body;

    const userId = (session.user as any)?.id ?? session.user?.email;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User session is missing an identifier" },
        { status: 401 },
      );
    }

    await dbConnect();
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 },
      );
    }

    const subtotal = cart.items.reduce((total: number, item: any) => {
      const price = Number(item.discountPrice ?? item.price ?? 0);
      return total + price * Number(item.quantity || 1);
    }, 0);

    const order = await Order.create({
      user: userId,
      items: cart.items.map((item: any) => ({
        productId: item.productId,
        title: item.title,
        price: Number(item.discountPrice ?? item.price ?? 0),
        quantity: Number(item.quantity || 1),
        image: item.image || "",
      })),
      subtotal,
      shipping: Number(shipping || 0),
      total: subtotal + Number(shipping || 0),
      status: "pending",
    });

    await Cart.deleteOne({ user: userId });
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
