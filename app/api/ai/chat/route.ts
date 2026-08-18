import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import "@/models/Category";
import Order from "@/models/Order";
import { getGroqClient, systemPrompt } from "@/lib/groq";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (message.trim().length > 500) {
      return NextResponse.json(
        { error: "Message is too long. Please keep it under 500 characters." },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);
    await dbConnect();

    const products = await Product.find({ stock: { $gt: 0 } })
      .populate("category", "name")
      .select("title price discountPrice stock category")
      .limit(50)
      .lean();

    const productContext = products
      .map((p: any) => {
        const category = p.category?.name || "General";
        const price = p.discountPrice
          ? `PKR ${(p.discountPrice * 278).toLocaleString()} (was PKR ${(p.price * 278).toLocaleString()})`
          : `PKR ${(p.price * 278).toLocaleString()}`;
        return `- ${p.title} | ${category} | ${price} | Stock: ${p.stock}`;
      })
      .join("\n");

    let orderContext = "";

    if (session?.user?.id) {
      const orders = await Order.find({ user: session.user.id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      if (orders.length > 0) {
        orderContext = `\n\nCustomer Recent Orders:\n${orders
          .map((o: any) => {
            const shortId = String(o._id).slice(-6).toUpperCase();
            return `- Order #${shortId} | Status: ${o.status} | Total: PKR ${(o.total * 278).toLocaleString()}`;
          })
          .join("\n")}`;
      }
    }

    const userContext = session?.user?.name
      ? `\n\nLogged in customer: ${session.user.name}. Address them by their first name naturally in conversation.`
      : `\n\nCustomer is a guest (not logged in).`;

    const contextMessage = `Available Products:\n${productContext}${orderContext}${userContext}\n\nCustomer message: ${message.trim()}`;

    const chatHistory = Array.isArray(history)
      ? history
          .filter(
            (h: any) =>
              h.role &&
              h.content &&
              (h.role === "user" || h.role === "assistant"),
          )
          .slice(-10)
          .map((h: any) => ({ role: h.role, content: h.content }))
      : [];

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...chatHistory,
      { role: "user" as const, content: contextMessage },
    ];

    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      model: "groq/compound-mini",
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const response =
      completion.choices[0]?.message?.content ||
      "I could not generate a response. Please try again.";

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error("AI chat error:", error);

    if (error.message?.includes("API key") || error.status === 401) {
      return NextResponse.json(
        { error: "AI service configuration error" },
        { status: 500 },
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        {
          error:
            "Wazir is experiencing high demand right now. Please try again in a moment.",
        },
        { status: 429 },
      );
    }

    if (error.status === 503) {
      return NextResponse.json(
        {
          error:
            "Wazir is experiencing high demand right now. Please try again in a moment.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
