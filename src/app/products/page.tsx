import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import Navigation from "@/components/public/Navigation";
import PublicFooter from "@/components/public/PublicFooter";
import ScrollAnimationProvider from "@/components/public/ScrollAnimationProvider";
import PublicProductCard from "@/components/public/PublicProductCard";
import ProductFilterBar from "@/components/public/ProductFilterBar";
import Pagination from "@/components/blog/Pagination";

export const metadata: Metadata = {
  title: "Sản Phẩm - Sữa Hạt Tươi 100% Tự Nhiên",
  description:
    "Khám phá bộ sưu tập sữa hạt tươi Hạt Mộc - sữa hạnh nhân, sữa hạt điều, sữa yến mạch và nhiều hơn nữa. Tươi mỗi ngày, giao hàng tận nơi.",
  openGraph: {
    title: "Sản Phẩm | Hạt Mộc",
    description: "Sữa hạt tươi 100% tự nhiên, giàu dinh dưỡng cho sức khoẻ mỗi ngày.",
    type: "website",
    locale: "vi_VN",
    siteName: "Hạt Mộc",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sản Phẩm | Hạt Mộc",
    description: "Sữa hạt tươi 100% tự nhiên, giàu dinh dưỡng cho sức khoẻ mỗi ngày.",
  },
  alternates: {
    canonical: "/products",
  },
};

const PRODUCTS_PER_PAGE = 12;

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function getProductsData(searchParams: Record<string, string | string[] | undefined>) {
  const category = typeof searchParams.category === "string" ? searchParams.category : "";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "featured";
  const page = typeof searchParams.page === "string" ? Math.max(1, parseInt(searchParams.page)) : 1;
  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  const where: Prisma.ProductWhereInput = {};
  if (category) {
    where.category = category;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput[];
  switch (sort) {
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    case "price_asc":
      orderBy = [{ price: "asc" }];
      break;
    case "price_desc":
      orderBy = [{ price: "desc" }];
      break;
    default: // featured
      orderBy = [{ isFeatured: "desc" }, { featuredPosition: "asc" }, { createdAt: "desc" }];
  }

  const [products, total, allProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        variants: { select: { id: true, size: true, price: true, stock: true } },
      },
      orderBy,
      take: PRODUCTS_PER_PAGE,
      skip,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categories = allProducts
    .map((p) => p.category)
    .filter((c): c is string => c !== null && c !== "")
    .sort();

  return {
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      image: p.image,
      images: p.images,
      price: p.price,
      category: p.category,
      tags: p.tags,
      isFeatured: p.isFeatured,
      featuredLabel: p.featuredLabel,
      variants: p.variants,
    })),
    pagination: {
      page,
      total,
      totalPages: Math.ceil(total / PRODUCTS_PER_PAGE),
    },
    categories,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const { products, pagination, categories } = await getProductsData(resolvedParams);

  return (
    <ScrollAnimationProvider>
      <main className="min-h-screen bg-brand-cream/30">
        <Navigation />

        {/* Header */}
        <section className="bg-gradient-to-br from-brand-green via-brand-green-dark to-brand-leaf py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <nav className="animate-on-scroll mb-4 font-open-sans text-sm text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Sản Phẩm</span>
            </nav>
            <h1 className="animate-on-scroll font-playfair text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Sản Phẩm Hạt Mộc
            </h1>
            <p className="animate-on-scroll animate-delay-100 mx-auto mt-4 max-w-2xl font-open-sans text-base leading-relaxed text-white/80 sm:text-lg">
              Sữa hạt tươi, ngon, tốt cho sức khoẻ mỗi ngày
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Filter & Sort */}
          <div className="animate-on-scroll mb-8">
            <Suspense>
              <ProductFilterBar categories={categories} />
            </Suspense>
          </div>

          {products.length === 0 ? (
            <div className="animate-on-scroll flex flex-col items-center justify-center py-20 text-center">
              <span className="mb-4 text-5xl">🌿</span>
              <h2 className="font-raleway text-xl font-bold text-brand-charcoal">
                Không tìm thấy sản phẩm
              </h2>
              <p className="mt-2 font-open-sans text-sm text-brand-gray">
                Hãy thử thay đổi bộ lọc để tìm sản phẩm phù hợp.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    className={`animate-on-scroll animate-delay-${((idx % 3) + 1) * 100}`}
                  >
                    <PublicProductCard product={product} />
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Suspense>
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                  />
                </Suspense>
              </div>
            </>
          )}
        </div>

        <PublicFooter />
      </main>
    </ScrollAnimationProvider>
  );
}
