import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const tags = searchParams.get("tags") || "";
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PostWhereInput = {
      status: "PUBLISHED",
    };

    // Search by title, excerpt
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by category slug
    if (category) {
      where.category = { slug: category };
    }

    // Filter by tags (any of the selected tags)
    if (tags) {
      const tagSlugs = tags.split(",").filter(Boolean);
      if (tagSlugs.length > 0) {
        where.tags = {
          some: {
            slug: { in: tagSlugs },
          },
        };
      }
    }

    // Determine sort order
    let orderBy: Prisma.PostOrderByWithRelationInput;
    switch (sort) {
      case "oldest":
        orderBy = { publishedAt: "asc" };
        break;
      case "popular":
        orderBy = { views: "desc" };
        break;
      default:
        orderBy = { publishedAt: "desc" };
    }

    // Execute queries in parallel
    const [posts, total, categories, allTags] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { name: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
        },
        orderBy,
        take: limit,
        skip,
      }),
      prisma.post.count({ where }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { posts: { where: { status: "PUBLISHED" } } } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.tag.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { posts: { where: { status: "PUBLISHED" } } } },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        language: post.language,
        publishedAt: post.publishedAt,
        views: post.views,
        author: post.author,
        category: post.category,
        tags: post.tags,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c._count.posts,
      })),
      tags: allTags
        .filter((t) => t._count.posts > 0)
        .map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          count: t._count.posts,
        })),
    });
  } catch (error) {
    console.error("Public blog API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
