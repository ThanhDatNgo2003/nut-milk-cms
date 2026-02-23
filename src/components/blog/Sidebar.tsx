import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import BlogPostCard, { type BlogPost } from "./BlogPostCard";
import SocialShare from "./SocialShare";
import TableOfContents from "./TableOfContents";

interface SidebarProps {
  headings: { id: string; text: string; level: number }[];
  recentPosts: BlogPost[];
  shareUrl: string;
  shareTitle: string;
  authorName?: string | null;
}

export default function Sidebar({
  headings,
  recentPosts,
  shareUrl,
  shareTitle,
  authorName,
}: SidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      {/* Table of Contents */}
      <TableOfContents headings={headings} />

      {/* Social Share */}
      <SocialShare url={shareUrl} title={shareTitle} />

      {/* Author Card */}
      {authorName && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-mint">
              <Leaf className="h-5 w-5 text-brand-green" />
            </div>
            <div>
              <p className="font-raleway text-sm font-bold text-brand-charcoal">
                {authorName}
              </p>
              <p className="font-open-sans text-xs text-brand-gray">Tác giả</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-xl bg-gradient-to-br from-brand-green to-brand-green-dark p-6 text-white shadow-md">
        <h3 className="mb-2 font-raleway text-lg font-bold">
          Khám phá sữa hạt Hạt Mộc
        </h3>
        <p className="mb-4 font-open-sans text-sm leading-relaxed text-white/80">
          Sản phẩm 100% tự nhiên, giàu dinh dưỡng cho sức khoẻ mỗi ngày.
        </p>
        <Link
          href="/#products"
          className="inline-flex items-center gap-1 rounded-lg bg-white/20 px-4 py-2 font-open-sans text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        >
          Xem sản phẩm
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-raleway text-sm font-bold text-brand-charcoal">
            Bài viết gần đây
          </h3>
          <div className="space-y-1">
            {recentPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
