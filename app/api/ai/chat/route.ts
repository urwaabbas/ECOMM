import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import "@/models/Category";
import Order from "@/models/Order";
import { getGroqClient, systemPrompt } from "@/lib/groq";

export const runtime = "nodejs";

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms),
  );
  return Promise.race([promise, timeout]);
}

async function getProductContext(): Promise<string> {
  try {
    const products = await withTimeout(
      Product.find({ stock: { $gt: 0 } })
        .populate("category", "name")
        .select("title price discountPrice stock category")
        .limit(20)
        .lean(),
      5000,
    );

    return products
      .map((p: any) => {
        const category = p.category?.name || "General";
        const price = p.discountPrice
          ? `PKR ${(p.discountPrice * 278).toLocaleString()} (was PKR ${(p.price * 278).toLocaleString()})`
          : `PKR ${(p.price * 278).toLocaleString()}`;
        return `- ${p.title} | ${category} | ${price} | Stock: ${p.stock}`;
      })
      .join("\n");
  } catch {
    return "Product catalog temporarily unavailable.";
  }
}

async function getOrderContext(userId: string): Promise<string> {
  try {
    const orders = await withTimeout(
      Order.find({ user: userId }).sort({ createdAt: -1 }).limit(5).lean(),
      5000,
    );

    if (!orders.length) return "";

    return `\n\nCustomer Recent Orders:\n${orders
      .map((o: any) => {
        const shortId = String(o._id).slice(-6).toUpperCase();
        return `- Order #${shortId} | Status: ${o.status} | Total: PKR ${(o.total * 278).toLocaleString()}`;
      })
      .join("\n")}`;
  } catch {
    return "";
  }
}

async function callGroqWithRetry(
  messages: any[],
  retries = 2,
): Promise<string> {
  const groq = getGroqClient();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const completion = await withTimeout(
        groq.chat.completions.create({
          model: "openai/gpt-oss-20b",
          messages,
          max_tokens: 300,
          temperature: 0.6,
        }),
        8000,
      );

      const response = completion.choices[0]?.message?.content;
      if (response) return response;
      throw new Error("Empty response");
    } catch (error: any) {
      const isRetryable =
        error.status === 503 ||
        error.status === 502 ||
        error.message === "Request timed out" ||
        error.message === "Empty response";

      if (isRetryable && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }

      throw error;
    }
  }

  throw new Error("All retries failed");
}

export async function POST(request: NextRequest) {
  try {
    let body: { message?: string; history?: any[] } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { message, history } = body;

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

    const [session] = await Promise.allSettled([getServerSession(authOptions)]);
    const user = session.status === "fulfilled" ? session.value?.user : null;

    try {
      await withTimeout(dbConnect(), 8000);
    } catch {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again." },
        { status: 503 },
      );
    }

    const [productContext, orderContext] = await Promise.all([
      getProductContext(),
      user?.id ? getOrderContext(user.id) : Promise.resolve(""),
    ]);

    const userContext = user?.name
      ? `\n\nLogged in customer: ${user.name}. You may greet them by first name only on the very first message. Do not repeat their name or greet them again in subsequent messages.`
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

    const response = await callGroqWithRetry(messages);

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
        { error: "Wazir is busy right now. Please try again in a moment." },
        { status: 429 },
      );
    }

    if (error.status === 503 || error.status === 502) {
      return NextResponse.json(
        {
          error:
            "Wazir is experiencing high demand. Please try again in a moment.",
        },
        { status: 503 },
      );
    }

    if (
      error.message === "Request timed out" ||
      error.message === "All retries failed"
    ) {
      return NextResponse.json(
        { error: "Wazir took too long to respond. Please try again." },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
