import dbConnect from "@/lib/db";
import User from "@/models/User";
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

  const newUser = await User.create({
    name,
    email,
    passwordHash: hashedPassword,
    role: "user",
  });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
}
