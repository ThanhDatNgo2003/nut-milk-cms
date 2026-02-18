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
    <section id="products" className="bg-brand-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-on-scroll mb-12 text-center">
          <h2 className="mb-4 font-raleway text-3xl font-bold text-brand-charcoal md:text-4xl">
            Sản Phẩm <span className="text-brand-green">Nổi Bật</span>
          </h2>
          <p className="mx-auto max-w-2xl font-open-sans text-brand-gray">
            Những sản phẩm sữa hạt được yêu thích nhất, được lựa chọn bởi hàng
            nghìn khách hàng.
          </p>
        </div>

        {/* Carousel */}
        <div className="animate-on-scroll animate-delay-200 relative">
          {/* Navigation buttons */}
          {products.length > 1 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2.5 shadow-lg transition-all duration-300 hover:bg-brand-cream hover:shadow-xl md:flex items-center justify-center"
                aria-label="Sản phẩm trước"
              >
                <ChevronLeft className="h-5 w-5 text-brand-green" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2.5 shadow-lg transition-all duration-300 hover:bg-brand-cream hover:shadow-xl md:flex items-center justify-center"
                aria-label="Sản phẩm tiếp"
              >
                <ChevronRight className="h-5 w-5 text-brand-green" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[280px] flex-shrink-0 snap-center md:w-[340px]"
              >
                <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Product Image */}
                  <div className="relative h-[220px] overflow-hidden bg-brand-cream md:h-[260px]">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-brand-gray">
                        <span className="text-5xl">🥛</span>
                      </div>
                    )}
                    {product.featuredLabel && (
                      <span className="absolute left-3 top-3 rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-white shadow">
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
                    <p className="mb-4 font-open-sans text-lg font-bold text-brand-green">
                      {product.price.toLocaleString("vi-VN")} VNĐ
                    </p>
                    {product.variants.length > 0 && (
                      <p className="mb-4 text-xs text-brand-gray">
                        {product.variants.length} kích thước có sẵn
                      </p>
                    )}
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-brand-green text-brand-green transition-all duration-300 hover:bg-brand-green hover:text-white hover:shadow-md"
                    >
                      Xem Chi Tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
