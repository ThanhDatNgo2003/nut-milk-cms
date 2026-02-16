"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { SupportedLanguage } from "@/lib/i18n";

export function useLanguage(defaultLang: SupportedLanguage = "VI") {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const langParam = searchParams.get("lang")?.toUpperCase();
  const language: SupportedLanguage =
    langParam === "EN" ? "EN" : langParam === "VI" ? "VI" : defaultLang;

  const setLanguage = useCallback(
    (lang: SupportedLanguage) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", lang.toLowerCase());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return { language, setLanguage };
}
