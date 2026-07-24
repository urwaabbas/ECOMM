import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    // 1. Get raw body and signature
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error("Webhook signature failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get userId from metadata
      const userId = session.metadata?.userId;

      if (!userId) {
        return NextResponse.json({ error: "No user ID" }, { status: 400 });
      }

      await dbConnect();

      const cart = await Cart.findOne({ user: userId });

      if (cart && cart.items.length > 0) {
        await Order.create({
          user: userId,
          items: cart.items,
          total: session.amount_total ? session.amount_total / 100 : 0,
          status: "paid",
          paymentId: session.payment_intent,
        });

        cart.items = [];
        await cart.save();

        console.log("✅ Order saved for user:", userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
