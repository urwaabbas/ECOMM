import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendVerificationOtp } from "@/lib/email";
import bcrypt from "bcryptjs";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: RegisterInput) {
  await dbConnect();

  const normalizedEmail = email.toLowerCase();

  const existUser = await User.findOne({ email: normalizedEmail });
  if (existUser) {
    throw new Error("This email is already registered");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const newUser = await User.create({
    name,
    email: normalizedEmail,
    passwordHash: hashedPassword,
    role: "user",
    isVerified: false,
    verificationOtp: otp,
    verificationOtpExpires,
  });

  try {
    await sendVerificationOtp(newUser.email, otp, newUser.name);
  } catch (emailError) {
    await User.findByIdAndDelete(newUser._id);
    throw new Error("Failed to send verification email. Please try again.");
  }

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    needsVerification: true,
  };
}