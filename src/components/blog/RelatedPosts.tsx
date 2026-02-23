import BlogPostCard, { type BlogPost } from "./BlogPostCard";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="animate-on-scroll mt-12 border-t border-gray-100 pt-10">
      <h2 className="mb-6 font-raleway text-2xl font-bold text-brand-charcoal">
        Bài viết liên quan
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
