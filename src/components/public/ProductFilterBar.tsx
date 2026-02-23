"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

interface ProductFilterBarProps {
  categories: string[];
}

export default function ProductFilterBar({ categories }: ProductFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get("category") || "";
  const activeSort = searchParams.get("sort") || "featured";

  const buildUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page");
      return `/products?${params.toString()}`;
    },
    [searchParams]
  );

  const handleCategoryChange = (cat: string) => {
    router.push(buildUrl({ category: activeCategory === cat ? null : cat }));
  };

  const handleSortChange = (sort: string) => {
    router.push(buildUrl({ sort: sort === "featured" ? null : sort }));
  };

  const hasActiveFilters = !!activeCategory;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-open-sans text-sm font-medium transition-all ${
            showFilters || hasActiveFilters
              ? "border-brand-green bg-brand-cream text-brand-green"
              : "border-gray-200 bg-white text-brand-charcoal hover:border-brand-green/40"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] text-white">
              1
            </span>
          )}
        </button>

        {/* Sort pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: "featured", label: "Nổi bật" },
            { value: "newest", label: "Mới nhất" },
            { value: "price_asc", label: "Giá thấp" },
            { value: "price_desc", label: "Giá cao" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSortChange(opt.value)}
              className={`rounded-full px-3 py-1.5 font-open-sans text-xs font-medium transition-all ${
                activeSort === opt.value
                  ? "bg-brand-green text-white"
                  : "bg-gray-100 text-brand-charcoal hover:bg-brand-cream hover:text-brand-green"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showFilters ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          {categories.length > 0 && (
            <div>
              <h4 className="mb-2 font-raleway text-xs font-semibold uppercase tracking-wider text-brand-gray">
                Loại sản phẩm
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`rounded-full px-3 py-1.5 font-open-sans text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-brand-green text-white"
                        : "bg-gray-100 text-brand-charcoal hover:bg-brand-cream hover:text-brand-green"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <button
              onClick={() => router.push("/products")}
              className="flex items-center gap-1 font-open-sans text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="h-3 w-3" />
              Xoá bộ lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
