import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { PostStatus } from "@/types";

interface RecentPostsProps {
  posts: Array<{
    id: string;
    title: string;
    status: PostStatus;
    createdAt: string | Date;
    category: { name: string } | null;
    author: { name: string | null; email: string };
  }>;
}

const statusVariants: Record<PostStatus, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  SCHEDULED: "outline",
  ARCHIVED: "destructive",
};

export default function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">No posts yet.</p>
    );
  }

  return (
    <ul className="divide-y">
      {posts.map((post) => (
        <li key={post.id} className="flex items-start justify-between gap-4 py-3">
          <div className="min-w-0 flex-1 space-y-1">
            <Link
              href={`/dashboard/blog/${post.id}`}
              className="text-sm font-medium truncate block hover:underline"
            >
              {post.title}
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              {post.category && <span>{post.category.name}</span>}
              <span>&middot;</span>
              <span>{post.author.name ?? post.author.email}</span>
              <span>&middot;</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          <Badge variant={statusVariants[post.status]} className="shrink-0 text-xs">
            {post.status}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
