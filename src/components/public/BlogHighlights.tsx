import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  language: string;
  publishedAt: string | null;
  author: { name: string | null };
  category: { id: string; name: string; slug: string } | null;
  tags: Array<{ id: string; name: string; slug: string }>;
}

interface BlogHighlightsProps {
  posts: BlogPost[];
}

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function BlogHighlights({ posts }: BlogHighlightsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-on-scroll mb-12 text-center">
          <h2 className="mb-4 font-raleway text-3xl font-bold text-brand-charcoal md:text-4xl">
            Bài Viết <span className="text-brand-green">Mới Nhất</span>
          </h2>
          <p className="mx-auto max-w-2xl font-open-sans text-brand-gray">
            Khám phá những bài viết hữu ích về sức khoẻ, dinh dưỡng và lối sống
            lành mạnh cùng Hạt Mộc.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post, i) => (
            <article
              key={post.id}
              className={`animate-on-scroll animate-delay-${(i + 1) * 100} group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Featured Image */}
              <div className="relative h-[200px] overflow-hidden bg-brand-cream">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-mint to-brand-cream">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                {post.category && (
                  <Badge className="absolute left-3 top-3 bg-brand-green text-white hover:bg-brand-green-dark">
                    {post.category.name}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="mb-2 line-clamp-2 font-raleway text-lg font-semibold text-brand-charcoal group-hover:text-brand-green transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mb-4 line-clamp-2 font-open-sans text-sm text-brand-gray">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-brand-gray">
                  <span>{post.author?.name || "Hạt Mộc"}</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <a
                  href="#"
                  className="mt-4 inline-flex items-center font-raleway text-sm font-semibold text-brand-green hover:text-brand-green-dark transition-colors"
                >
                  Đọc Thêm
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
