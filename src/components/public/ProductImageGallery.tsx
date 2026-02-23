"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  mainImage: string;
  images: string[];
  productName: string;
}

export default function ProductImageGallery({
  mainImage,
  images,
  productName,
}: ProductImageGalleryProps) {
  const allImages = [mainImage, ...images].filter(Boolean);
  const [selected, setSelected] = useState(0);
  const isLocal = allImages[selected]?.startsWith("/uploads");

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-cream shadow-sm">
        {allImages[selected] ? (
          <Image
            src={allImages[selected]}
            alt={`${productName} - Ảnh ${selected + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            unoptimized={!!isLocal}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-6xl">🌿</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, idx) => {
            const isThumbLocal = img?.startsWith("/uploads");
            return (
              <button
                key={idx}
                onClick={() => setSelected(idx)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  selected === idx
                    ? "border-brand-green shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} - Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized={!!isThumbLocal}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
