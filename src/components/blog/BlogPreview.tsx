"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDate, calculateReadingTime } from "@/lib/utils";
import type { PostWithRelations } from "@/types";

interface BlogPreviewProps {
  post: PostWithRelations;
}

export default function BlogPreview({ post }: BlogPreviewProps) {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge>{post.category.name}</Badge>
          <span className="text-sm text-muted-foreground">
            {calculateReadingTime(post.content)} min read
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        {post.excerpt && (
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {post.author.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <p className="font-medium text-foreground">{post.author.name}</p>
            <p>
              {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {post.featuredImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-sm sm:prose-base max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t pt-6">
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </article>
  );
}
