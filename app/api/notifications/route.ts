import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (
      session?.user as { id?: string } | undefined
    )?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    await dbConnect();

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({
        recipient: userId,
      })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean(),

      Notification.countDocuments({
        recipient: userId,
        isRead: false,
      }),
    ]);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Failed to fetch user notifications:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notifications",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (
      session?.user as { id?: string } | undefined
    )?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    await dbConnect();

    const body = await request.json().catch(() => ({}));

    const notificationId =
      typeof body.notificationId === "string"
        ? body.notificationId.trim()
        : "";

    if (notificationId) {
      if (!Types.ObjectId.isValid(notificationId)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid notification ID",
          },
          { status: 400 },
        );
      }

      await Notification.updateOne(
        {
          _id: notificationId,
          recipient: userId,
        },
        {
          $set: {
            isRead: true,
          },
        },
      );
    } else {
      await Notification.updateMany(
        {
          recipient: userId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to update user notifications:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update notifications",
      },
      { status: 500 },
    );
  }
}