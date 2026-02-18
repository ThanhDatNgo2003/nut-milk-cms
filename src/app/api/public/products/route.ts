import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const featured = searchParams.get("featured");
    const language = (searchParams.get("language") || "").toUpperCase();

    const where: Prisma.ProductWhereInput = {};

    if (language === "VI" || language === "EN") {
      where.language = language;
    }
    if (featured === "true") {
      where.isFeatured = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: {
          select: {
            id: true,
            size: true,
            price: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        image: product.image,
        price: product.price,
        category: product.category,
        language: product.language,
        isFeatured: product.isFeatured,
        featuredLabel: product.featuredLabel,
        variants: product.variants,
      })),
    });
  } catch (error) {
    console.error("Public products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
