import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (query.length < 2) {
      return NextResponse.json({ success: true, orders: [], users: [], products: [] });
    }

    await dbConnect();

    const [orders, users, products] = await Promise.all([
      Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean()
        .then((allOrders) =>
          allOrders
            .filter((o) => {
              const shortId = String(o._id).slice(-6).toUpperCase();
              const fullId = String(o._id).toUpperCase();
              const q = query.toUpperCase().replace("#", "");
              return shortId.includes(q) || fullId.includes(q);
            })
            .slice(0, 5),
        ),

      User.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      })
        .select("name email role")
        .limit(5)
        .lean(),

      Product.find({
        title: { $regex: query, $options: "i" },
      })
        .select("title price stock images")
        .limit(5)
        .lean(),
    ]);

    return NextResponse.json({ success: true, orders, users, products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}