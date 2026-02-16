import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const lang = searchParams.get("lang") || "";

    const where: Prisma.PostWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"].includes(status)) {
      where.status = status as Prisma.EnumPostStatusFilter;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (lang && ["VI", "EN"].includes(lang.toUpperCase())) {
      where.language = lang.toUpperCase() as "VI" | "EN";
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: true,
          translations: {
            select: { id: true, language: true, title: true, slug: true, status: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { createPostSchema } = await import("@/lib/validation");
    const result = createPostSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues;
      const message = issues && issues.length > 0 ? issues[0].message : "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { tagIds, linkWithId, ...postData } = result.data;

    const existing = await prisma.post.findFirst({
      where: { slug: postData.slug, language: postData.language || "VI" },
    });
    if (existing) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }

    const category = await prisma.category.findUnique({ where: { id: postData.categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        ...postData,
        status: postData.status || "DRAFT",
        authorId: session.user.id,
        publishedAt: postData.status === "PUBLISHED" ? new Date() : null,
        tags: tagIds?.length ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
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

    // Link as translation if linkWithId provided
    if (linkWithId) {
      const sourcePost = await prisma.post.findUnique({ where: { id: linkWithId } });
      if (sourcePost) {
        const groupId = sourcePost.translationGroupId || sourcePost.id;
        // Set group on source if not already set
        if (!sourcePost.translationGroupId) {
          await prisma.post.update({
            where: { id: sourcePost.id },
            data: { translationGroupId: groupId },
          });
        }
        // Link new post to the group
        await prisma.post.update({
          where: { id: post.id },
          data: { translationGroupId: groupId },
        });
      }
    }

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
