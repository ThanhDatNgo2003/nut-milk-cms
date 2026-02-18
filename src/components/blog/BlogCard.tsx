"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash2, Globe, GlobeLock, Languages } from "lucide-react";
import { formatDate, calculateReadingTime } from "@/lib/utils";
import { getLanguageFlag, getOppositeLanguage } from "@/lib/i18n";
import type { SupportedLanguage } from "@/lib/i18n";
import type { PostWithRelations } from "@/types";

interface BlogCardProps {
  post: PostWithRelations;
  onPublish?: (id: string, action: "publish" | "unpublish") => void;
  onDelete?: (id: string) => void;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  SCHEDULED: "outline",
  ARCHIVED: "destructive",
};

export default function BlogCard({ post, onPublish, onDelete }: BlogCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
      {post.featuredImage && (
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="112px" unoptimized
          />
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant={statusColors[post.status]}>{post.status}</Badge>
          <Badge variant="outline" className="text-xs">
            {getLanguageFlag(post.language as SupportedLanguage)} {post.language}
          </Badge>
          <span className="text-xs text-muted-foreground">{post.category.name}</span>
          <span className="text-xs text-muted-foreground">
            {calculateReadingTime(post.content)} min read
          </span>
        </div>
        <Link href={`/dashboard/blog/${post.id}`} className="block">
          <h3 className="font-semibold truncate hover:underline">{post.title}</h3>
        </Link>
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{post.author.name}</span>
          <span>&middot;</span>
          <span>{formatDate(post.createdAt)}</span>
          {post.publishedAt && (
            <>
              <span>&middot;</span>
              <span>Published {formatDate(post.publishedAt)}</span>
            </>
          )}
          <span>&middot;</span>
          <span>{post.views} views</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex gap-1 pt-1">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/blog/${post.id}`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/blog/${post.id}/preview`}>
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/blog/new?from=${post.id}&lang=${getOppositeLanguage(post.language as SupportedLanguage).toLowerCase()}`}>
              <Languages className="mr-2 h-4 w-4" /> Translate
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {post.status === "PUBLISHED" ? (
            <DropdownMenuItem onClick={() => onPublish?.(post.id, "unpublish")}>
              <GlobeLock className="mr-2 h-4 w-4" /> Unpublish
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onPublish?.(post.id, "publish")}>
              <Globe className="mr-2 h-4 w-4" /> Publish
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete?.(post.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
