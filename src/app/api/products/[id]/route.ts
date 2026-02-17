import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (body.slug && body.slug !== existing.slug) {
      const targetLang = body.language || existing.language;
      const slugTaken = await prisma.product.findFirst({
        where: {
          slug: body.slug,
          language: targetLang,
          NOT: { id },
        },
      });
      if (slugTaken) {
        return NextResponse.json(
          { error: "A product with this slug already exists in this language" },
          { status: 409 }
        );
      }
    }

    if (body.isFeatured === true && !existing.isFeatured) {
      const featuredCount = await prisma.product.count({
        where: { isFeatured: true, NOT: { id } },
      });
      if (featuredCount >= 3) {
        return NextResponse.json(
          { error: "Maximum 3 featured products allowed" },
          { status: 400 }
        );
      }
    }

    const { variants, ...updateData } = body;

    const updated = await prisma.$transaction(async (tx) => {
      if (variants !== undefined) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
      }
      return tx.product.update({
        where: { id },
        data: {
          ...updateData,
          ...(variants !== undefined ? { variants: { create: variants } } : {}),
        },
        include: { variants: true },
      });
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ data: { message: "Product deleted successfully" } });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
