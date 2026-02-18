"use client";

import { use } from "react";
import { usePost } from "@/hooks/useBlog";
import BlogPreview from "@/components/blog/BlogPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";

export default function PreviewBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = usePost(id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Post not found.</p>
        <Button asChild className="mt-4"><Link href="/blog">Back to posts</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Preview Mode</span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/blog/${id}`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
        </Button>
      </div>

      <BlogPreview post={data.data} />
    </div>
  );
}
