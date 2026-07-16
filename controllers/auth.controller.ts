import { NextResponse } from "next/server";

import { registerUser } from "@/services/auth.service";

export async function handleRegister(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    const newUser = await registerUser({ name, email, password });

    return NextResponse.json(
      {
        message:
          "Registered successfully. Please verify your email before logging in.",
        user: newUser,
        verificationUrl: newUser.verificationUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("❌ Registration Handler Error:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
