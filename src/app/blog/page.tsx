import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import Navigation from "@/components/public/Navigation";
import PublicFooter from "@/components/public/PublicFooter";
import ScrollAnimationProvider from "@/components/public/ScrollAnimationProvider";
import BlogPostCard from "@/components/blog/BlogPostCard";
import SearchFilterBar from "@/components/blog/SearchFilterBar";
import Pagination from "@/components/blog/Pagination";

export const metadata: Metadata = {
  title: "Blog - Kiến Thức Sức Khoẻ & Dinh Dưỡng",
  description:
    "Khám phá các bài viết về sức khoẻ, dinh dưỡng, lối sống lành mạnh và công dụng tuyệt vời của sữa hạt tự nhiên.",
  openGraph: {
    title: "Blog | Hạt Mộc",
    description:
      "Kiến thức sức khoẻ, dinh dưỡng và lối sống lành mạnh từ Hạt Mộc.",
    type: "website",
    locale: "vi_VN",
    siteName: "Hạt Mộc",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Hạt Mộc",
    description:
      "Kiến thức sức khoẻ, dinh dưỡng và lối sống lành mạnh từ Hạt Mộc.",
  },
  alternates: {
    canonical: "/blog",
  },
};

const POSTS_PER_PAGE = 10;

interface BlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function getBlogData(searchParams: Record<string, string | string[] | undefined>) {
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "";
  const tagsParam = typeof searchParams.tags === "string" ? searchParams.tags : "";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  const page = typeof searchParams.page === "string" ? Math.max(1, parseInt(searchParams.page)) : 1;
  const skip = (page - 1) * POSTS_PER_PAGE;

  // Build where clause
  const where: Prisma.PostWhereInput = { status: "PUBLISHED" };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }
  if (tagsParam) {
    const tagSlugs = tagsParam.split(",").filter(Boolean);
    if (tagSlugs.length > 0) {
      where.tags = { some: { slug: { in: tagSlugs } } };
    }
  }

  let orderBy: Prisma.PostOrderByWithRelationInput;
  switch (sort) {
    case "oldest":
      orderBy = { publishedAt: "asc" };
      break;
    case "popular":
      orderBy = { views: "desc" };
      break;
    default:
      orderBy = { publishedAt: "desc" };
  }

  const [posts, total, categories, allTags] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { name: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
      orderBy,
      take: POSTS_PER_PAGE,
      skip,
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { posts: { where: { status: "PUBLISHED" } } } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { posts: { where: { status: "PUBLISHED" } } } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    posts: posts.map((p) => ({
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
    })),
    pagination: {
      page,
      total,
      totalPages: Math.ceil(total / POSTS_PER_PAGE),
    },
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c._count.posts,
    })),
    tags: allTags
      .filter((t) => t._count.posts > 0)
      .map((t) => ({ id: t.id, name: t.name, slug: t.slug, count: t._count.posts })),
    hasFilters: !!(search || category || tagsParam),
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const { posts, pagination, categories, tags, hasFilters } = await getBlogData(resolvedParams);

  // First post as featured if on page 1 with no filters
  const featuredPost = !hasFilters && pagination.page === 1 && posts.length > 0 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <ScrollAnimationProvider>
      <main className="min-h-screen bg-brand-cream/30">
        <Navigation />

        {/* Blog Header */}
        <section className="bg-gradient-to-br from-brand-green via-brand-green-dark to-brand-leaf py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="animate-on-scroll font-playfair text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Blog Hạt Mộc
            </h1>
            <p className="animate-on-scroll animate-delay-100 mx-auto mt-4 max-w-2xl font-open-sans text-base leading-relaxed text-white/80 sm:text-lg">
              Kiến thức sức khoẻ, dinh dưỡng và bí quyết sống khoẻ mỗi ngày
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Search & Filters */}
          <div className="animate-on-scroll mb-8">
            <Suspense>
              <SearchFilterBar categories={categories} tags={tags} />
            </Suspense>
          </div>

          {posts.length === 0 ? (
            /* Empty State */
            <div className="animate-on-scroll flex flex-col items-center justify-center py-20 text-center">
              <span className="mb-4 text-5xl">🔍</span>
              <h2 className="font-raleway text-xl font-bold text-brand-charcoal">
                Không tìm thấy bài viết
              </h2>
              <p className="mt-2 font-open-sans text-sm text-brand-gray">
                Hãy thử thay đổi từ khoá hoặc bộ lọc để tìm bài viết phù hợp.
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-10">
                  <BlogPostCard post={featuredPost} variant="featured" />
                </div>
              )}

              {/* Post Grid */}
              {gridPosts.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {gridPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className={`animate-on-scroll animate-delay-${((idx % 3) + 1) * 100}`}
                    >
                      <BlogPostCard post={post} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
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
