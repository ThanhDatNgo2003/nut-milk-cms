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

export const metadata: Metadata = {
  title: "Nut Milk | Sua Hat Tuoi 100% Tu Nhien",
  description:
    "Sua hat tuoi nguyen chat, khong chat bao quan. San pham huu co, giau dinh duong, tot cho suc khoe. Giao hang tan noi tai Ho Chi Minh City.",
  keywords: [
    "sua hat",
    "sua hat tuoi",
    "nut milk",
    "sua huu co",
    "sua hat dieu",
    "sua hanh nhan",
    "healthy drink",
    "Ho Chi Minh",
  ],
  openGraph: {
    title: "Nut Milk | Sua Hat Tuoi 100% Tu Nhien",
    description:
      "Sua hat tuoi nguyen chat, khong chat bao quan. San pham huu co, giau dinh duong.",
    type: "website",
    locale: "vi_VN",
    siteName: "Nut Milk",
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
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <WhyChooseUs />
      <ProductCarousel products={featuredProducts} />
      <BrandStory />
      <BlogHighlights posts={latestPosts} />
      <Newsletter />
      <PublicFooter />
    </main>
  );
}
