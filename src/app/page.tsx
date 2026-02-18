import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navigation from "@/components/public/Navigation";
import HeroSection from "@/components/public/HeroSection";
import WhyChooseUs from "@/components/public/WhyChooseUs";
import ProductCarousel from "@/components/public/ProductCarousel";
import BrandStory from "@/components/public/BrandStory";
import BlogHighlights from "@/components/public/BlogHighlights";
import Newsletter from "@/components/public/Newsletter";
import PublicFooter from "@/components/public/PublicFooter";
import ScrollAnimationProvider from "@/components/public/ScrollAnimationProvider";

export const metadata: Metadata = {
  title: "Hạt Mộc | Sữa Hạt Tươi 100% Tự Nhiên",
  description:
    "Sữa hạt tươi nguyên chất, không chất bảo quản. Sản phẩm hữu cơ, giàu dinh dưỡng, tốt cho sức khoẻ. Giao hàng tận nơi tại Hồ Chí Minh.",
  keywords: [
    "sữa hạt",
    "sữa hạt tươi",
    "hạt mộc",
    "sữa hữu cơ",
    "sữa hạt điều",
    "sữa hạnh nhân",
    "healthy drink",
    "Hồ Chí Minh",
  ],
  openGraph: {
    title: "Hạt Mộc | Sữa Hạt Tươi 100% Tự Nhiên",
    description:
      "Sữa hạt tươi nguyên chất, không chất bảo quản. Sản phẩm hữu cơ, giàu dinh dưỡng.",
    type: "website",
    locale: "vi_VN",
    siteName: "Hạt Mộc",
  },
};

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
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
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      image: p.image,
      price: p.price,
      category: p.category,
      isFeatured: p.isFeatured,
      featuredLabel: p.featuredLabel,
      featuredPosition: p.featuredPosition,
      variants: p.variants,
    }));
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

async function getLatestPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: { select: { name: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
    return posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      featuredImage: p.featuredImage,
      language: p.language,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      author: p.author,
      category: p.category,
      tags: p.tags,
    }));
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, latestPosts] = await Promise.all([
    getFeaturedProducts(),
    getLatestPosts(),
  ]);

  return (
    <ScrollAnimationProvider>
      <main className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        <WhyChooseUs />
        <ProductCarousel products={featuredProducts} />
        <BrandStory />
        <BlogHighlights posts={latestPosts} />
        <Newsletter />
        <PublicFooter />
      </main>
    </ScrollAnimationProvider>
  );
}
