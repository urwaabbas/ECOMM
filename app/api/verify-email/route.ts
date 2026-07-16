// app/api/verify-email/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    // 1. Extract the token from the query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is missing." },
        { status: 400 }
      );
    }

    await dbConnect();

    // 2. Find user by verification token AND ensure the token has not expired yet
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }, // Expiry date must be in the future
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid token or verification link has expired." },
        { status: 400 }
      );
    }

    // 3. Update the user status: mark as verified, and clear the token fields
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    // 4. Redirect the user directly to your login page with a success query parameter
    // (This ensures they don't just see raw JSON, they get redirected to your beautiful UI!)
    const loginUrl = new URL("/login?verified=true", request.url);
    return NextResponse.redirect(loginUrl);

  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during verification." },
      { status: 500 }
    );
  }
}