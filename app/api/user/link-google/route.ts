import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    let body: { googleId?: string; image?: string } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { googleId, image } = body;

    if (!googleId) {
      return NextResponse.json({ error: "Google ID is required" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const user = await User.findByIdAndUpdate(
      userId,
      { googleId, image: image || undefined },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Google account linked successfully" });
  } catch (error) {
    console.error("Link Google error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}