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
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured") || "";
    const lang = searchParams.get("lang") || "";

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (lang && ["VI", "EN"].includes(lang.toUpperCase())) {
      where.language = lang.toUpperCase() as "VI" | "EN";
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { variants: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { createProductSchema } = await import("@/lib/validation");
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues;
      const message = issues && issues.length > 0 ? issues[0].message : "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { variants, ...productData } = result.data;

    const existing = await prisma.product.findFirst({
      where: { slug: productData.slug, language: productData.language },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists in this language" },
        { status: 409 }
      );
    }

    if (productData.isFeatured) {
      const featuredCount = await prisma.product.count({ where: { isFeatured: true } });
      if (featuredCount >= 3) {
        return NextResponse.json(
          { error: "Maximum 3 featured products allowed" },
          { status: 400 }
        );
      }

      if (!productData.featuredPosition) {
        const featuredProducts = await prisma.product.findMany({
          where: { isFeatured: true },
          select: { featuredPosition: true },
        });
        const usedPositions = new Set(
          featuredProducts.map((p) => p.featuredPosition).filter(Boolean)
        );
        const nextPosition = [1, 2, 3].find((pos) => !usedPositions.has(pos)) || 1;
        productData.featuredPosition = nextPosition;
      }
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: variants && variants.length > 0 ? { create: variants } : undefined,
      },
      include: { variants: true },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
