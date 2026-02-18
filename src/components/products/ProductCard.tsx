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
import { MoreHorizontal, Pencil, Trash2, Star, StarOff } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getLanguageFlag } from "@/lib/i18n";
import type { SupportedLanguage } from "@/lib/i18n";
import type { ProductWithVariants } from "@/types";

interface ProductCardProps {
  product: ProductWithVariants;
  onToggleFeatured?: (id: string, isFeatured: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function ProductCard({
  product,
  onToggleFeatured,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          {product.isFeatured && (
            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white gap-1">
              <Star className="h-3 w-3 fill-current" />
              Featured
              {product.featuredPosition != null && (
                <span className="font-normal">#{product.featuredPosition}</span>
              )}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {getLanguageFlag(product.language as SupportedLanguage)} {product.language}
          </Badge>
          {product.category && (
            <span className="text-xs text-muted-foreground">{product.category}</span>
          )}
        </div>

        <Link href={`/dashboard/products/${product.id}`} className="block">
          <h3 className="font-semibold truncate hover:underline">{product.name}</h3>
        </Link>

        <p className="text-sm font-medium text-foreground">
          {product.price.toLocaleString("vi-VN")} VND
        </p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {product.variants.length} variant{product.variants.length !== 1 ? "s" : ""}
          </span>
          <span>&middot;</span>
          <span>{formatDate(product.createdAt)}</span>
          <span>&middot;</span>
          <span>{product.views} views</span>
        </div>

        {product.tags.length > 0 && (
          <div className="flex gap-1 pt-1 flex-wrap">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
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
            <Link href={`/dashboard/products/${product.id}`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onToggleFeatured?.(product.id, !product.isFeatured)}
          >
            {product.isFeatured ? (
              <>
                <StarOff className="mr-2 h-4 w-4" /> Unfeature
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" /> Feature
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete?.(product.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
