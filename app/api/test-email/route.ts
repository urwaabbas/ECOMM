// app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Built-in Node.js module
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await dbConnect();

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Generate Verification Token & Expiry (24 Hours)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // 5. Create the User in DB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false, // Explicitly unverified on signup
      verificationToken,
      verificationTokenExpires,
    });

    // 6. Send the Email (Asynchronously, so the user registration doesn't wait)
    try {
      await sendVerificationEmail(newUser.email, verificationToken, newUser.name);
    } catch (emailError) {
      console.error("User created but verification email failed to send:", emailError);
      // We don't block the API response if the email sending fails, but we log it.
    }

    return NextResponse.json(
      { message: "Registration successful! Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 550 });
  }
}