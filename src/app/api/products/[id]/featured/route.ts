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
    const { isFeatured, position, label } = body as {
      isFeatured: boolean;
      position?: number;
      label?: string;
    };

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let updateData: {
      isFeatured: boolean;
      featuredPosition?: number | null;
      featuredLabel?: string | null;
    } = { isFeatured };

    if (isFeatured) {
      const featuredCount = await prisma.product.count({
        where: { isFeatured: true, NOT: { id } },
      });
      if (featuredCount >= 3) {
        return NextResponse.json(
          { error: "Maximum 3 featured products allowed" },
          { status: 400 }
        );
      }

      let featuredPosition = position;
      if (!featuredPosition) {
        const featuredProducts = await prisma.product.findMany({
          where: { isFeatured: true, NOT: { id } },
          select: { featuredPosition: true },
        });
        const usedPositions = new Set(
          featuredProducts.map((p) => p.featuredPosition).filter(Boolean)
        );
        featuredPosition = [1, 2, 3].find((pos) => !usedPositions.has(pos)) || 1;
      }

      updateData = {
        isFeatured: true,
        featuredPosition,
        featuredLabel: label ?? existing.featuredLabel,
      };
    } else {
      updateData = {
        isFeatured: false,
        featuredPosition: null,
        featuredLabel: null,
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { variants: true },
    });

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("Error updating featured status:", error);
    return NextResponse.json({ error: "Failed to update featured status" }, { status: 500 });
  }
}
