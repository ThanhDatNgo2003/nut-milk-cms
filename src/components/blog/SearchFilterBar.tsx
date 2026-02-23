"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface TagOption {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface SearchFilterBarProps {
  categories: CategoryOption[];
  tags: TagOption[];
}

export default function SearchFilterBar({ categories, tags }: SearchFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showFilters, setShowFilters] = useState(false);
  const activeCategory = searchParams.get("category") || "";
  const activeTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const activeSort = searchParams.get("sort") || "newest";

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
      // Reset to page 1 on filter change
      params.delete("page");
      return `/blog?${params.toString()}`;
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ search: search || null }));
  };

  const handleCategoryChange = (slug: string) => {
    router.push(buildUrl({ category: activeCategory === slug ? null : slug }));
  };

  const handleTagToggle = (slug: string) => {
    const newTags = activeTags.includes(slug)
      ? activeTags.filter((t) => t !== slug)
      : [...activeTags, slug];
    router.push(buildUrl({ tags: newTags.length > 0 ? newTags.join(",") : null }));
  };

  const handleSortChange = (sort: string) => {
    router.push(buildUrl({ sort: sort === "newest" ? null : sort }));
  };

  const hasActiveFilters = activeCategory || activeTags.length > 0 || search;

  const clearAllFilters = () => {
    setSearch("");
    router.push("/blog");
  };

  return (
    <div className="space-y-4">
      {/* Search + Filter Toggle */}
      <div className="flex gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 font-open-sans text-sm text-brand-charcoal placeholder:text-brand-gray/60 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                router.push(buildUrl({ search: null }));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-charcoal"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-open-sans text-sm font-medium transition-all ${
            showFilters || hasActiveFilters
              ? "border-brand-green bg-brand-cream text-brand-green"
              : "border-gray-200 bg-white text-brand-charcoal hover:border-brand-green/40"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Bộ lọc</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] text-white">
              {(activeCategory ? 1 : 0) + activeTags.length + (search ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Expandable Filter Panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showFilters ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-5">
          {/* Sort */}
          <div>
            <h4 className="mb-2 font-raleway text-xs font-semibold uppercase tracking-wider text-brand-gray">
              Sắp xếp
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "newest", label: "Mới nhất" },
                { value: "oldest", label: "Cũ nhất" },
                { value: "popular", label: "Phổ biến" },
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

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h4 className="mb-2 font-raleway text-xs font-semibold uppercase tracking-wider text-brand-gray">
                Danh mục
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`rounded-full px-3 py-1.5 font-open-sans text-xs font-medium transition-all ${
                      activeCategory === cat.slug
                        ? "bg-brand-green text-white"
                        : "bg-gray-100 text-brand-charcoal hover:bg-brand-cream hover:text-brand-green"
                    }`}
                  >
                    {cat.name}
                    <span className="ml-1 opacity-60">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h4 className="mb-2 font-raleway text-xs font-semibold uppercase tracking-wider text-brand-gray">
                Thẻ
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.slug)}
                    className={`rounded-full px-3 py-1.5 font-open-sans text-xs font-medium transition-all ${
                      activeTags.includes(tag.slug)
                        ? "bg-brand-green-dark text-white"
                        : "bg-gray-100 text-brand-charcoal hover:bg-brand-cream hover:text-brand-green"
                    }`}
                  >
                    #{tag.name}
                    <span className="ml-1 opacity-60">({tag.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 font-open-sans text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="h-3 w-3" />
              Xoá tất cả bộ lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
