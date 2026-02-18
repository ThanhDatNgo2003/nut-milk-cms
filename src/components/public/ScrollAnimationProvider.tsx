"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollAnimationProviderProps {
  children: ReactNode;
}

export default function ScrollAnimationProvider({
  children,
}: ScrollAnimationProviderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const targets = el.querySelectorAll(".animate-on-scroll");
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}
