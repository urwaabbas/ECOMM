import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Notification from "@/models/Notification";
import { sendPushToUser } from "@/lib/push-notification";
import "@/models/User";

const allowedStatuses = [
  "pending",
  "paid",
  "processing",
  "completed",
  "cancelled",
] as const;

type OrderStatus = (typeof allowedStatuses)[number];

const statusLabels: Record<OrderStatus, string> = {
  pending: "pending",
  paid: "paid",
  processing: "being processed",
  completed: "completed",
  cancelled: "cancelled",
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  if (session.user.role !== "admin") {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 },
      ),
    };
  }

  return {
    session,
    error: null,
  };
}

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (auth.error) {
      return auth.error;
    }

    await dbConnect();

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch orders";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (auth.error) {
      return auth.error;
    }

    const body = await request.json();
    const orderId =
      typeof body.orderId === "string" ? body.orderId.trim() : "";
    const nextStatus =
      typeof body.status === "string" ? body.status.trim() : "";

    if (!Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID" },
        { status: 400 },
      );
    }

    if (!allowedStatuses.includes(nextStatus as OrderStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid order status" },
        { status: 400 },
      );
    }

    await dbConnect();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    if (order.status === nextStatus) {
      return NextResponse.json({
        success: true,
        order,
        notificationCreated: false,
        pushSent: false,
      });
    }

    order.status = nextStatus;
    await order.save();

    const shortOrderId = String(order._id).slice(-6).toUpperCase();
    const readableStatus = statusLabels[nextStatus as OrderStatus];
    const message =
      `Your order #${shortOrderId} is now ${readableStatus}.`;

    await Notification.create({
      title: "Order Status Updated",
      message,
      type: "order_update",
      recipient: order.user,
      order: order._id,
    });

    const pushSent = await sendPushToUser(
      String(order.user),
      {
        title: "Order Status Updated",
        message,
        link: "/orders",
      },
    );

    return NextResponse.json({
      success: true,
      order,
      notificationCreated: true,
      pushSent,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update order";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
