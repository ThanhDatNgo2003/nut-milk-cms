import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Get blog post - to be implemented" });
}

export async function PATCH() {
  return NextResponse.json({ message: "Update blog post - to be implemented" });
}

export async function DELETE() {
  return NextResponse.json({ message: "Delete blog post - to be implemented" });
}
