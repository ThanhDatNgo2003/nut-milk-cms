import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "3")));
    const language = (searchParams.get("language") || "").toUpperCase();

    const where: Prisma.PostWhereInput = {
      status: "PUBLISHED",
    };

    if (language === "VI" || language === "EN") {
      where.language = language;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { name: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        tags: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        language: post.language,
        publishedAt: post.publishedAt,
        author: post.author,
        category: post.category,
        tags: post.tags,
      })),
    });
  } catch (error) {
    console.error("Public posts API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
