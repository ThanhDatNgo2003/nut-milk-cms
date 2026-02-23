"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  items: FAQItem[];
}

interface FAQAccordionProps {
  categories: FAQCategory[];
}

export default function FAQAccordion({ categories }: FAQAccordionProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const allCategories = ["Tất Cả", ...categories.map((c) => c.name)];

  const filteredItems = useMemo(() => {
    const items: (FAQItem & { category: string })[] = [];
    for (const cat of categories) {
      for (const item of cat.items) {
        if (activeCategory !== "Tất Cả" && cat.name !== activeCategory) continue;
        if (
          search &&
          !item.question.toLowerCase().includes(search.toLowerCase()) &&
          !item.answer.toLowerCase().includes(search.toLowerCase())
        ) {
          continue;
        }
        items.push({ ...item, category: cat.name });
      }
    }
    return items;
  }, [categories, activeCategory, search]);

  const toggleItem = (question: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(question)) {
        next.delete(question);
      } else {
        next.add(question);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="animate-on-scroll relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm câu hỏi..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 font-open-sans text-sm text-brand-charcoal placeholder:text-brand-gray/60 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-charcoal"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="animate-on-scroll animate-delay-100 flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3.5 py-1.5 font-open-sans text-xs font-medium transition-all ${
              activeCategory === cat
                ? "bg-brand-green text-white"
                : "bg-gray-100 text-brand-charcoal hover:bg-brand-cream hover:text-brand-green"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion Items */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center">
            <span className="mb-3 block text-3xl">🔍</span>
            <p className="font-open-sans text-sm text-brand-gray">
              Không tìm thấy câu hỏi phù hợp.
            </p>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isOpen = openItems.has(item.question);
            return (
              <div
                key={`${item.category}-${idx}`}
                className="animate-on-scroll overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleItem(item.question)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-brand-cream/30"
                >
                  <span className="font-raleway text-sm font-semibold text-brand-charcoal pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-green transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-gray-50 bg-brand-cream/30 px-5 py-4">
                    <p className="font-open-sans text-sm leading-relaxed text-brand-gray">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
