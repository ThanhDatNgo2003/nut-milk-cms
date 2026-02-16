"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getLanguageFlag,
  SUPPORTED_LANGUAGES,
} from "@/lib/i18n";
import type { SupportedLanguage } from "@/lib/i18n";

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
  disabled?: boolean;
}

export default function LanguageSelector({
  value,
  onChange,
  disabled,
}: LanguageSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as SupportedLanguage)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          {getLanguageFlag(value)} {value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {getLanguageFlag(lang)} {lang}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
