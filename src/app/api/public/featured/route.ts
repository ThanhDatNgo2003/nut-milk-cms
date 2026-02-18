import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
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
      orderBy: { featuredPosition: "asc" },
      take: 3,
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
        isFeatured: product.isFeatured,
        featuredLabel: product.featuredLabel,
        featuredPosition: product.featuredPosition,
        variants: product.variants,
      })),
    });
  } catch (error) {
    console.error("Public featured API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
