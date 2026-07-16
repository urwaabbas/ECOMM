import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: RegisterInput) {
  await dbConnect();

  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new Error("this email is already registered");
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
    isVerified: false,
    verificationToken,
    verificationTokenExpires,
  });

  let verificationUrl: string | null = null;

  try {
    await sendVerificationEmail(newUser.email, verificationToken, newUser.name);
  } catch (emailError) {
    console.error("Verification email could not be sent:", emailError);
    verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/verify-email?token=${verificationToken}`;
  }

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    needsVerification: true,
    verificationUrl,
  };
}

