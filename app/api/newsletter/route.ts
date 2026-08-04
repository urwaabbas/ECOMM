import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Newsletter from "@/models/Newsletter";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await connectDB();
    await Newsletter.create({ email });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}