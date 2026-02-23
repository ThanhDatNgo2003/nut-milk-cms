import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { formatDateVN, calculateReadingTime, truncateText, stripHtml } from "@/lib/blog-utils";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  featuredImage: string | null;
  language: string;
  publishedAt: string | null;
  views?: number;
  author: { name: string | null } | null;
  category: { id: string; name: string; slug: string } | null;
  tags: { id: string; name: string; slug: string }[];
}

interface BlogPostCardProps {
  post: BlogPost;
  variant?: "default" | "featured" | "compact";
}

export default function BlogPostCard({ post, variant = "default" }: BlogPostCardProps) {
  const readingTime = post.content ? calculateReadingTime(post.content) : 3;
  const excerpt = post.excerpt || (post.content ? truncateText(stripHtml(post.content), 150) : "");
  const isLocal = post.featuredImage?.startsWith("/uploads");

  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex gap-4 rounded-xl p-3 transition-colors hover:bg-brand-cream"
      >
        {post.featuredImage && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="80px"
              unoptimized={!!isLocal}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-raleway text-sm font-semibold text-brand-charcoal line-clamp-2 group-hover:text-brand-green transition-colors">
            {post.title}
          </h4>
          {post.publishedAt && (
            <p className="mt-1 font-open-sans text-xs text-brand-gray">
              {formatDateVN(post.publishedAt)}
            </p>
          )}
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <article className="animate-on-scroll group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="relative aspect-[16/9] overflow-hidden">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={!!isLocal}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-brand-mint to-brand-cream flex items-center justify-center">
                <span className="text-4xl">🌿</span>
              </div>
            )}
            {post.category && (
              <span className="absolute top-4 left-4 rounded-full bg-brand-green px-3 py-1 font-open-sans text-xs font-medium text-white shadow-md">
                {post.category.name}
              </span>
            )}
          </div>
        </Link>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-4 font-open-sans text-xs text-brand-gray">
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
          </div>
          <Link href={`/blog/${post.slug}`}>
            <h2 className="font-raleway text-xl font-bold text-brand-charcoal line-clamp-2 transition-colors group-hover:text-brand-green">
              {post.title}
            </h2>
          </Link>
          {excerpt && (
            <p className="mt-2 font-open-sans text-sm leading-relaxed text-brand-gray line-clamp-3">
              {excerpt}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between">
            {post.author?.name && (
              <span className="font-open-sans text-xs text-brand-gray">
                Bởi <span className="font-medium text-brand-charcoal">{post.author.name}</span>
              </span>
            )}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 font-open-sans text-sm font-medium text-brand-green transition-colors hover:text-brand-green-dark"
            >
              Đọc thêm
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article className="animate-on-scroll group overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={!!isLocal}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand-mint to-brand-cream flex items-center justify-center">
              <span className="text-3xl">🌿</span>
            </div>
          )}
          {post.category && (
            <span className="absolute top-3 left-3 rounded-full bg-brand-green/90 px-2.5 py-0.5 font-open-sans text-xs font-medium text-white">
              {post.category.name}
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-3 font-open-sans text-xs text-brand-gray">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDateVN(post.publishedAt)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingTime} phút đọc
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-raleway text-lg font-bold text-brand-charcoal line-clamp-2 transition-colors group-hover:text-brand-green">
            {post.title}
          </h3>
        </Link>
        {excerpt && (
          <p className="mt-2 font-open-sans text-sm leading-relaxed text-brand-gray line-clamp-2">
            {excerpt}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-brand-cream px-2 py-0.5 font-open-sans text-xs text-brand-green-dark"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
