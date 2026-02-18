"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  price: number;
  category: string | null;
  isFeatured: boolean;
  featuredLabel: string | null;
  featuredPosition: number | null;
  variants: ProductVariant[];
}

interface ProductCarouselProps {
  products: FeaturedProduct[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section id="products" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-raleway text-3xl font-bold text-brand-brown md:text-4xl">
            San Pham Noi Bat
          </h2>
          <p className="mx-auto max-w-2xl font-open-sans text-brand-gray">
            Nhung san pham sua hat duoc yeu thich nhat, duoc lua chon boi hang
            nghin khach hang.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          {products.length > 1 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-brand-offwhite md:flex items-center justify-center"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 text-brand-brown" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-brand-offwhite md:flex items-center justify-center"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 text-brand-brown" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[280px] flex-shrink-0 snap-center md:w-[340px]"
              >
                <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
                  {/* Product Image */}
                  <div className="relative h-[220px] overflow-hidden bg-brand-offwhite md:h-[260px]">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-brand-gray">
                        <span className="text-4xl">🥛</span>
                      </div>
                    )}
                    {product.featuredLabel && (
                      <span className="absolute left-3 top-3 rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold text-white shadow">
                        {product.featuredLabel}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {product.category && (
                      <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wider text-brand-gray">
                        {product.category}
                      </span>
                    )}
                    <h3 className="mb-2 font-raleway text-lg font-semibold text-brand-charcoal">
                      {product.name}
                    </h3>
                    <p className="mb-4 font-open-sans text-lg font-bold text-brand-brown">
                      {product.price.toLocaleString("vi-VN")} VND
                    </p>
                    {product.variants.length > 0 && (
                      <p className="mb-4 text-xs text-brand-gray">
                        {product.variants.length} kich thuoc co san
                      </p>
                    )}
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white transition-colors"
                    >
                      Xem Chi Tiet
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View all CTA */}
        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center font-raleway text-sm font-semibold text-brand-brown hover:text-brand-brown-dark transition-colors"
          >
            Xem Tat Ca San Pham
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
