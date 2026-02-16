import { NextResponse } from "next/server";

// Logout is handled by NextAuth via signOut()
// This route provides a simple redirect/info endpoint
export async function POST() {
  return NextResponse.json(
    {
      message: "Use NextAuth signOut() on the client side or POST to /api/auth/signout",
    },
    { status: 200 }
  );
}
