// app/api/verify-email/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    // 1. Extract and validate the token from the URL parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      console.warn("⚠️ Verification attempt failed: Missing token.");
      return NextResponse.json(
        { error: "Verification token is missing." },
        { status: 400 }
      );
    }

    // 2. Connect to Database
    await dbConnect();

    // 3. Locate user with non-expired token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }, // Token must expire in the future
    });

    if (!user) {
      console.warn("⚠️ Verification attempt failed: Invalid or expired token.");
      return NextResponse.json(
        { error: "Invalid token or verification link has expired." },
        { status: 400 }
      );
    }

    // 4. Mark user as verified and clear temporary fields
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    console.log(`✅ User verified successfully: ${user.email}`);

    // 5. Redirect user to the login screen with a query flag to trigger UI success state
    const loginUrl = new URL("/login?verified=true", request.url);
    return NextResponse.redirect(loginUrl);

  } catch (error: any) {
    console.error("❌ Email verification backend error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during verification." },
      { status: 500 }
    );
  }
}