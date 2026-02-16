import { NextResponse } from "next/server";

// Login is handled by NextAuth [...nextauth] route
// This route provides a simple redirect/info endpoint
export async function POST() {
  return NextResponse.json(
    {
      message: "Use /api/auth/callback/credentials for login via NextAuth",
      hint: "POST to /api/auth/callback/credentials with email and password",
    },
    { status: 200 }
  );
}
