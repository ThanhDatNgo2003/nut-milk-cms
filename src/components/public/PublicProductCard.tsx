"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";

export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  category: string | null;
  tags: string[];
  isFeatured: boolean;
  featuredLabel: string | null;
  variants: { id: string; size: string; price: number; stock: number }[];
}

interface PublicProductCardProps {
  product: PublicProduct;
}

export default function PublicProductCard({ product }: PublicProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [liked, setLiked] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const isLocal = product.image?.startsWith("/uploads");
  const inStock = selectedVariant ? selectedVariant.stock > 0 : true;

  return (
    <article className="animate-on-scroll group overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={!!isLocal}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand-mint to-brand-cream flex items-center justify-center">
              <span className="text-4xl">🌿</span>
            </div>
          )}
          {product.isFeatured && product.featuredLabel && (
            <span className="absolute top-3 left-3 rounded-full bg-brand-green px-2.5 py-1 font-open-sans text-[11px] font-bold text-white shadow-md">
              {product.featuredLabel}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        {/* Category */}
        {product.category && (
          <span className="font-open-sans text-[11px] font-medium uppercase tracking-wider text-brand-gray">
            {product.category}
          </span>
        )}

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-raleway text-base font-bold text-brand-charcoal line-clamp-2 transition-colors group-hover:text-brand-green">
            {product.name}
          </h3>
        </Link>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-cream px-2 py-0.5 font-open-sans text-[10px] text-brand-green-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div>
          <span className="font-raleway text-lg font-bold text-brand-charcoal">
            {currentPrice.toLocaleString("vi-VN")}₫
          </span>
          {!inStock && (
            <span className="ml-2 font-open-sans text-xs text-red-500">Hết hàng</span>
          )}
        </div>

        {/* Variants */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(v);
                }}
                className={`rounded-md border px-2 py-1 font-open-sans text-xs transition-all ${
                  selectedVariant?.id === v.id
                    ? "border-brand-green bg-brand-cream text-brand-green font-medium"
                    : "border-gray-200 text-brand-gray hover:border-brand-green/40"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <Link
            href={`/products/${product.slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-green px-3 py-2 font-open-sans text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
          >
            <ShoppingBag className="h-4 w-4" />
            Xem chi tiết
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
              liked
                ? "border-red-300 bg-red-50 text-red-500"
                : "border-gray-200 text-brand-gray hover:border-red-300 hover:text-red-400"
            }`}
            aria-label="Yêu thích"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
