import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Notification from "@/models/Notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      console.error("Webhook signature failed:", error);

      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 },
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) {
        return NextResponse.json(
          { error: "No user ID" },
          { status: 400 },
        );
      }

      await dbConnect();

      const paymentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || session.id;

      const existingOrder = await Order.findOne({ paymentId });

      if (existingOrder) {
        return NextResponse.json({ received: true });
      }

      const cart = await Cart.findOne({ user: userId });

      if (cart && cart.items.length > 0) {
        const order = await Order.create({
          user: userId,
          items: cart.items,
          shippingInfo: {
            name: session.metadata?.shippingName || "",
            email: session.metadata?.shippingEmail || "",
            phone: session.metadata?.shippingPhone || "",
            address: session.metadata?.shippingAddress || "",
            city: session.metadata?.shippingCity || "",
          },
          subtotal: session.amount_total ? session.amount_total / 100 : 0,
          shipping: 0,
          total: session.amount_total ? session.amount_total / 100 : 0,
          status: "paid",
          paymentId,
        });

        const totalPKR = Math.round(order.total * 278).toLocaleString("en-PK");

        await Notification.create({
          title: "New Order Received",
          message: `${order.shippingInfo.name || "A customer"} placed an order worth PKR ${totalPKR}.`,
          type: "new_order",
          order: order._id,
        });

        cart.items = [];
        await cart.save();

        console.log("Order and notification saved for user:", userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown webhook error";

    console.error("Webhook error:", message);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 },
    );
  }
}