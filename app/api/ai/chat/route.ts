import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getGeminiClient, systemPrompt } from "@/lib/gemini";

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
          .map((h: any) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
          }))
      : [];

    const gemini = getGeminiClient();
    const model = gemini.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: systemPrompt,
    });
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(contextMessage);
    const response = result.response.text();

    if (!response) {
      return NextResponse.json(
        { error: "I could not generate a response. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      response,
    });
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
        { error: "AI service is busy. Please try again in a moment." },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
