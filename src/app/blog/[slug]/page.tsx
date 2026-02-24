import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateVN, calculateReadingTime, extractHeadings, addHeadingIds } from "@/lib/blog-utils";
import Navigation from "@/components/public/Navigation";
import PublicFooter from "@/components/public/PublicFooter";
import ScrollAnimationProvider from "@/components/public/ScrollAnimationProvider";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import Sidebar from "@/components/blog/Sidebar";
import RelatedPosts from "@/components/blog/RelatedPosts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      category: { select: { id: true, name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!post) return null;

  // Increment views
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    language: post.language,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    updatedAt: post.updatedAt.toISOString(),
    views: post.views,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    metaKeywords: post.metaKeywords,
    author: post.author,
    category: post.category,
    categoryId: post.categoryId,
    tags: post.tags,
  };
}

async function getRelatedPosts(postId: string, categoryId: string, tagIds: string[]) {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: postId },
      OR: [
        { categoryId },
        ...(tagIds.length > 0 ? [{ tags: { some: { id: { in: tagIds } } } }] : []),
      ],
    },
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
    content: p.content,
    featuredImage: p.featuredImage,
    language: p.language,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    views: p.views,
    author: p.author,
    category: p.category,
    tags: p.tags,
  }));
}

async function getRecentPosts(excludeId: string) {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", id: { not: excludeId } },
    include: {
      author: { select: { name: true } },
      category: { select: { id: true, name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
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
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Không tìm thấy bài viết" };

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || "";

  return {
    title: `${title} | Blog Hạt Mộc`,
    description,
    keywords: post.metaKeywords.length > 0 ? post.metaKeywords : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "vi_VN",
      siteName: "Hạt Mộc",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const [relatedPosts, recentPosts] = await Promise.all([
    getRelatedPosts(post.id, post.categoryId, post.tags.map((t) => t.id)),
    getRecentPosts(post.id),
  ]);

  const readingTime = calculateReadingTime(post.content);
  const processedContent = addHeadingIds(post.content);
  const headings = extractHeadings(processedContent);
  const isLocalImage = post.featuredImage?.startsWith("/uploads");

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hatmoc.vn";

  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    image: post.featuredImage || undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${baseUrl}/blog/${post.slug}`,
    wordCount: post.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
    keywords: post.metaKeywords.length > 0 ? post.metaKeywords.join(", ") : undefined,
    author: {
      "@type": "Person",
      name: post.author?.name || "Hạt Mộc",
    },
    publisher: {
      "@type": "Organization",
      name: "Hạt Mộc",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      ...(post.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: post.category.name,
              item: `${baseUrl}/blog?category=${post.category.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: post.title,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
            },
          ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ReadingProgressBar />
      <ScrollAnimationProvider>
        <main className="min-h-screen bg-white">
          <Navigation />

          {/* Article Header */}
          <header className="bg-gradient-to-br from-brand-cream to-white pb-8 pt-8 sm:pt-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav className="animate-on-scroll mb-6 flex items-center gap-2 font-open-sans text-sm text-brand-gray">
                <Link href="/" className="hover:text-brand-green transition-colors">
                  Trang chủ
                </Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-brand-green transition-colors">
                  Blog
                </Link>
                {post.category && (
                  <>
                    <span>/</span>
                    <Link
                      href={`/blog?category=${post.category.slug}`}
                      className="hover:text-brand-green transition-colors"
                    >
                      {post.category.name}
                    </Link>
                  </>
                )}
              </nav>

              {/* Category Badge */}
              {post.category && (
                <Link
                  href={`/blog?category=${post.category.slug}`}
                  className="animate-on-scroll inline-block rounded-full bg-brand-green/10 px-3 py-1 font-open-sans text-xs font-medium text-brand-green transition-colors hover:bg-brand-green/20"
                >
                  {post.category.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="animate-on-scroll animate-delay-100 mt-4 font-playfair text-3xl font-bold leading-tight text-brand-charcoal sm:text-4xl lg:text-[2.75rem]">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="animate-on-scroll animate-delay-200 mt-4 flex flex-wrap items-center gap-4 font-open-sans text-sm text-brand-gray">
                {post.author?.name && (
                  <span className="font-medium text-brand-charcoal">
                    {post.author.name}
                  </span>
                )}
                {post.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDateVN(post.publishedAt)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {readingTime} phút đọc
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {post.views} lượt xem
                </span>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="animate-on-scroll animate-delay-300 mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tags=${tag.slug}`}
                      className="flex items-center gap-1 rounded-full bg-brand-mint px-2.5 py-1 font-open-sans text-xs text-brand-green-dark transition-colors hover:bg-brand-green/10"
                    >
                      <Tag className="h-3 w-3" />
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="animate-on-scroll mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="relative -mt-2 aspect-[21/9] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                  unoptimized={!!isLocalImage}
                />
              </div>
            </div>
          )}

          {/* Content + Sidebar */}
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-10 lg:flex-row">
              {/* Article Content */}
              <article className="min-w-0 flex-1">
                <div
                  className="blog-prose animate-on-scroll"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                {/* Back to Blog */}
                <div className="mt-10 border-t border-gray-100 pt-6">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 font-open-sans text-sm font-medium text-brand-green transition-colors hover:text-brand-green-dark"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Quay về Blog
                  </Link>
                </div>
              </article>

              {/* Sidebar */}
              <div className="w-full shrink-0 lg:w-80">
                <Sidebar
                  headings={headings}
                  recentPosts={recentPosts}
                  shareUrl={`/blog/${post.slug}`}
                  shareTitle={post.title}
                  authorName={post.author?.name}
                />
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-gray-100 bg-brand-cream/30">
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <RelatedPosts posts={relatedPosts} />
              </div>
            </div>
          )}

          <PublicFooter />
        </main>
      </ScrollAnimationProvider>
    </>
  );
}
