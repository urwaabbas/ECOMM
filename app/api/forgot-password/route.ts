import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendPasswordResetOtp } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    let body: { email?: string } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpires = resetOtpExpires;
    await user.save();

    try {
      await sendPasswordResetOtp(normalizedEmail, otp, user.name);
    } catch (emailError) {
      user.resetOtp = null;
      user.resetOtpExpires = null;
      await user.save();
      console.error("Email sending failed:", emailError);
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Password reset code sent. Please check your inbox." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}