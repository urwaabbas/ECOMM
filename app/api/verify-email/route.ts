// app/api/verify-email/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
  
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is missing." },
        { status: 400 }
      );
    }

    await dbConnect();


    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }, 
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid token or verification link has expired." },
        { status: 400 }
      );
    }


    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

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


