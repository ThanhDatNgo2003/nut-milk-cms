"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
}

/**
 * A responsive image component built on Next.js <Image>.
 *
 * - Supports both local uploads (/uploads/...) and remote URLs
 * - Shows a fallback placeholder for missing images
 * - Lazy loads by default (unless priority is set)
 */
export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className,
  containerClassName,
}: ResponsiveImageProps) {
  const [hasError, setHasError] = useState(false);

  // Determine if this is a local upload (served as static file)
  const isLocal = src.startsWith("/uploads/");

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          fill ? "absolute inset-0" : "",
          containerClassName
        )}
        style={!fill ? { width: width || "100%", height: height || 200 } : undefined}
      >
        <div className="text-center">
          <ImageOff className="mx-auto h-8 w-8 mb-1 opacity-50" />
          <p className="text-xs opacity-50">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : (width || 800)}
      height={fill ? undefined : (height || 600)}
      fill={fill}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      // Local uploads don't go through the Next.js image optimizer by default
      // because they're served as static files. We set unoptimized for local
      // files to avoid the "hostname not configured" error.
      unoptimized={isLocal}
      className={cn("object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
}
