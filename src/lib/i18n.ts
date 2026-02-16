export type SupportedLanguage = "VI" | "EN";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["VI", "EN"];

export function getLanguageLabel(lang: SupportedLanguage): string {
  const labels: Record<SupportedLanguage, string> = {
    VI: "Vietnamese",
    EN: "English",
  };
  return labels[lang];
}

export function getLanguageFlag(lang: SupportedLanguage): string {
  const flags: Record<SupportedLanguage, string> = {
    VI: "🇻🇳",
    EN: "🇬🇧",
  };
  return flags[lang];
}

export function getOppositeLanguage(lang: SupportedLanguage): SupportedLanguage {
  return lang === "VI" ? "EN" : "VI";
}

export function normalizeLang(lang: string | null | undefined): SupportedLanguage {
  if (lang?.toUpperCase() === "EN") return "EN";
  return "VI";
}
