import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";

    if (token.length < 20) {
      return NextResponse.json(
        { success: false, error: "A valid FCM token is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { fcmToken: token } },
      { new: true },
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "FCM token saved",
    });
  } catch (error) {
    console.error("Failed to save FCM token:", error);

    return NextResponse.json(
      { success: false, error: "Failed to save FCM token" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    await User.findByIdAndUpdate(session.user.id, {
      $set: { fcmToken: null },
    });

    return NextResponse.json({
      success: true,
      message: "FCM token removed",
    });
  } catch (error) {
    console.error("Failed to remove FCM token:", error);

    return NextResponse.json(
      { success: false, error: "Failed to remove FCM token" },
      { status: 500 },
    );
  }
}
