import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Get product - to be implemented" });
}

export async function PATCH() {
  return NextResponse.json({ message: "Update product - to be implemented" });
}

export async function DELETE() {
  return NextResponse.json({ message: "Delete product - to be implemented" });
}
