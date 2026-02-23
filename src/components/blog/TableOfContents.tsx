"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TOCItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 font-raleway text-sm font-bold text-brand-charcoal">
        <List className="h-4 w-4 text-brand-green" />
        Mục lục
      </h3>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(heading.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                // Offset for sticky header
                window.scrollBy(0, -80);
              }
            }}
            className={`block rounded-md py-1.5 font-open-sans text-sm transition-all ${
              heading.level === 3 ? "pl-6" : "pl-3"
            } ${
              activeId === heading.id
                ? "bg-brand-cream font-medium text-brand-green"
                : "text-brand-gray hover:bg-brand-cream/50 hover:text-brand-charcoal"
            }`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
