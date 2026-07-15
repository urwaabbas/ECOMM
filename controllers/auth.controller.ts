import { NextResponse } from "next/server";
// Double-check your filename here! (is it 'services.ts' or 'auth.service.ts'?)
import { registerUser } from "@/services/auth.service"; 

export async function handleRegister(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Basic empty check
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // 2. Corrected Email format validation (Must include BOTH '@' and '.')
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // 3. Register user in database
    const newUser = await registerUser({ name, email, password });
    
    return NextResponse.json(
      {
        message: 'Registered Successfully',
        user: newUser,
      },
      { status: 201 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    console.error("❌ Registration Handler Error:", errorMessage);

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}