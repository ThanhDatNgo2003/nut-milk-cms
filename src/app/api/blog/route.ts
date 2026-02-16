import { NextResponse } from "next/server";

export async function GET() {
  // Will be implemented in Phase 2
  return NextResponse.json({ total: 0, posts: [] });
}

export async function POST() {
  // Will be implemented in Phase 2
  return NextResponse.json({ message: "Create blog post - to be implemented" });
}
