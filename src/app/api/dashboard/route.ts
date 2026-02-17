import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [postCount, productCount, viewCount, userCount, recentPosts, featuredProducts] =
      await Promise.all([
        prisma.post.count(),
        prisma.product.count(),
        prisma.pageView.count(),
        prisma.user.count(),
        prisma.post.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, email: true } },
            category: true,
          },
        }),
        prisma.product.findMany({
          where: { isFeatured: true },
          orderBy: { featuredPosition: "asc" },
          include: { variants: true },
        }),
      ]);

    return NextResponse.json({
      data: {
        stats: { posts: postCount, products: productCount, views: viewCount, users: userCount },
        recentPosts,
        featuredProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
