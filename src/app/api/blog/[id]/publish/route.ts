import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (action === "publish") {
      if (!existing.title || !existing.content || !existing.categoryId) {
        return NextResponse.json(
          { error: "Post must have title, content, and category to publish" },
          { status: 400 }
        );
      }

      const post = await prisma.post.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedAt: existing.publishedAt || new Date(),
        },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: true,
          translations: {
            select: { id: true, language: true, title: true, slug: true, status: true },
          },
        },
      });

      return NextResponse.json({ data: post });
    }

    if (action === "unpublish") {
      const post = await prisma.post.update({
        where: { id },
        data: { status: "DRAFT" },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: true,
          translations: {
            select: { id: true, language: true, title: true, slug: true, status: true },
          },
        },
      });

      return NextResponse.json({ data: post });
    }

    return NextResponse.json({ error: "Invalid action. Use 'publish' or 'unpublish'" }, { status: 400 });
  } catch (error) {
    console.error("Error publishing post:", error);
    return NextResponse.json({ error: "Failed to update post status" }, { status: 500 });
  }
}
