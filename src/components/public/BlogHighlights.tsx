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
    <section id="blog" className="bg-brand-offwhite py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-raleway text-3xl font-bold text-brand-brown md:text-4xl">
            Bai Viet Moi Nhat
          </h2>
          <p className="mx-auto max-w-2xl font-open-sans text-brand-gray">
            Kham pha nhung bai viet huu ich ve suc khoe, dinh duong va loi song
            lanh manh cung Nut Milk.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              {/* Featured Image */}
              <div className="relative h-[200px] overflow-hidden bg-brand-offwhite">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-gold/20 to-brand-brown/10">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                {post.category && (
                  <Badge className="absolute left-3 top-3 bg-brand-brown text-white hover:bg-brand-brown-dark">
                    {post.category.name}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="mb-2 line-clamp-2 font-raleway text-lg font-semibold text-brand-charcoal group-hover:text-brand-brown transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mb-4 line-clamp-2 font-open-sans text-sm text-brand-gray">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-brand-gray">
                  <span>{post.author?.name || "Nut Milk"}</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <a
                  href="#"
                  className="mt-4 inline-flex items-center font-raleway text-sm font-semibold text-brand-brown hover:text-brand-brown-dark transition-colors"
                >
                  Doc Them
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* View all CTA */}
        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center font-raleway text-sm font-semibold text-brand-brown hover:text-brand-brown-dark transition-colors"
          >
            Xem Tat Ca Bai Viet
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
