import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Leaf, Shield, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Navigation from "@/components/public/Navigation";
import PublicFooter from "@/components/public/PublicFooter";
import ScrollAnimationProvider from "@/components/public/ScrollAnimationProvider";
import ProductImageGallery from "@/components/public/ProductImageGallery";
import ProductDetailClient from "@/components/public/ProductDetailClient";
import PublicProductCard from "@/components/public/PublicProductCard";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug },
    include: {
      variants: {
        select: { id: true, size: true, price: true, stock: true },
        orderBy: { price: "asc" },
      },
    },
  });

  if (!product) return null;

  // Increment views
  await prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  return product;
}

async function getRelatedProducts(productId: string, category: string | null) {
  const where = category
    ? { id: { not: productId }, category }
    : { id: { not: productId } };

  const products = await prisma.product.findMany({
    where,
    include: {
      variants: { select: { id: true, size: true, price: true, stock: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return products.map((p) => ({
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
  }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };

  const title = product.metaTitle || product.name;
  const description = product.metaDescription || product.description.slice(0, 160);

  return {
    title: `${title} | Hạt Mộc`,
    description,
    keywords: product.metaKeywords.length > 0 ? product.metaKeywords : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "vi_VN",
      siteName: "Hạt Mộc",
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.id, product.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "VND",
      lowPrice: product.variants.length > 0
        ? Math.min(...product.variants.map((v) => v.price))
        : product.price,
      highPrice: product.variants.length > 0
        ? Math.max(...product.variants.map((v) => v.price))
        : product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollAnimationProvider>
        <main className="min-h-screen bg-white">
          <Navigation />

          {/* Breadcrumb */}
          <div className="bg-brand-cream/50">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <nav className="animate-on-scroll flex items-center gap-2 font-open-sans text-sm text-brand-gray">
                <Link href="/" className="hover:text-brand-green transition-colors">Trang chủ</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-brand-green transition-colors">Sản phẩm</Link>
                {product.category && (
                  <>
                    <span>/</span>
                    <Link
                      href={`/products?category=${encodeURIComponent(product.category)}`}
                      className="hover:text-brand-green transition-colors"
                    >
                      {product.category}
                    </Link>
                  </>
                )}
                <span>/</span>
                <span className="text-brand-charcoal font-medium truncate">{product.name}</span>
              </nav>
            </div>
          </div>

          {/* Product Header - 2 columns */}
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-10 lg:flex-row">
              {/* Left - Gallery */}
              <div className="animate-on-scroll w-full lg:w-1/2">
                <ProductImageGallery
                  mainImage={product.image}
                  images={product.images}
                  productName={product.name}
                />
              </div>

              {/* Right - Details */}
              <div className="animate-on-scroll animate-delay-100 w-full lg:w-1/2 space-y-6">
                {/* Category */}
                {product.category && (
                  <Link
                    href={`/products?category=${encodeURIComponent(product.category)}`}
                    className="inline-block rounded-full bg-brand-green/10 px-3 py-1 font-open-sans text-xs font-medium text-brand-green hover:bg-brand-green/20 transition-colors"
                  >
                    {product.category}
                  </Link>
                )}

                {/* Title */}
                <h1 className="font-playfair text-2xl font-bold text-brand-charcoal sm:text-3xl lg:text-4xl">
                  {product.name}
                </h1>

                {/* Views */}
                <p className="font-open-sans text-sm text-brand-gray">
                  {product.views} lượt xem
                </p>

                {/* Price + Variants + CTA (client component) */}
                <ProductDetailClient
                  price={product.price}
                  variants={product.variants}
                />

                {/* Short Description */}
                <p className="font-open-sans text-sm leading-relaxed text-brand-gray">
                  {product.description.length > 300
                    ? product.description.slice(0, 300) + "..."
                    : product.description}
                </p>

                {/* Key Benefits */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-brand-cream p-3 text-center">
                    <Leaf className="h-6 w-6 text-brand-green" />
                    <span className="font-open-sans text-xs font-medium text-brand-charcoal">
                      Tự nhiên
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-brand-cream p-3 text-center">
                    <Shield className="h-6 w-6 text-brand-green" />
                    <span className="font-open-sans text-xs font-medium text-brand-charcoal">
                      An toàn
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-brand-cream p-3 text-center">
                    <Zap className="h-6 w-6 text-brand-green" />
                    <span className="font-open-sans text-xs font-medium text-brand-charcoal">
                      Giàu dinh dưỡng
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-brand-mint px-2.5 py-1 font-open-sans text-xs text-brand-green-dark"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Full Description */}
          <section className="border-t border-gray-100 bg-brand-cream/20">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="animate-on-scroll mb-6 font-raleway text-2xl font-bold text-brand-charcoal">
                Thông tin chi tiết
              </h2>
              <div className="animate-on-scroll blog-prose">
                {product.description.split("\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>

          {/* Back link */}
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-open-sans text-sm font-medium text-brand-green transition-colors hover:text-brand-green-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay về Sản phẩm
            </Link>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="border-t border-gray-100 bg-brand-cream/30">
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h2 className="animate-on-scroll mb-8 font-raleway text-2xl font-bold text-brand-charcoal">
                  Sản phẩm liên quan
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedProducts.map((p) => (
                    <PublicProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          <PublicFooter />
        </main>
      </ScrollAnimationProvider>
    </>
  );
}
