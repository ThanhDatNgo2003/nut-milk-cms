import {
  getLanguageLabel,
  getLanguageFlag,
  getOppositeLanguage,
  normalizeLang,
  SUPPORTED_LANGUAGES,
} from "@/lib/i18n";
import { createPostSchema } from "@/lib/validation";

describe("Language Utilities (i18n.ts)", () => {
  it("returns correct label for VI", () => {
    expect(getLanguageLabel("VI")).toBe("Vietnamese");
  });

  it("returns correct label for EN", () => {
    expect(getLanguageLabel("EN")).toBe("English");
  });

  it("returns correct flag for VI", () => {
    expect(getLanguageFlag("VI")).toBe("🇻🇳");
  });

  it("returns correct flag for EN", () => {
    expect(getLanguageFlag("EN")).toBe("🇬🇧");
  });

  it("getOppositeLanguage returns EN for VI", () => {
    expect(getOppositeLanguage("VI")).toBe("EN");
  });

  it("getOppositeLanguage returns VI for EN", () => {
    expect(getOppositeLanguage("EN")).toBe("VI");
  });

  it("normalizeLang defaults to VI for null", () => {
    expect(normalizeLang(null)).toBe("VI");
  });

  it("normalizeLang handles lowercase en", () => {
    expect(normalizeLang("en")).toBe("EN");
  });

  it("normalizeLang defaults to VI for undefined", () => {
    expect(normalizeLang(undefined)).toBe("VI");
  });

  it("SUPPORTED_LANGUAGES contains exactly VI and EN", () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(2);
    expect(SUPPORTED_LANGUAGES).toContain("VI");
    expect(SUPPORTED_LANGUAGES).toContain("EN");
  });
});

describe("createPostSchema with language field", () => {
  const validPost = {
    title: "Test Post",
    content: "<p>Content</p>",
    categoryId: "cat-123",
  };

  it("accepts VI as language", () => {
    const result = createPostSchema.safeParse({ ...validPost, language: "VI" });
    expect(result.success).toBe(true);
  });

  it("accepts EN as language", () => {
    const result = createPostSchema.safeParse({ ...validPost, language: "EN" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid language value", () => {
    const result = createPostSchema.safeParse({ ...validPost, language: "FR" });
    expect(result.success).toBe(false);
  });

  it("defaults to VI when language is omitted", () => {
    const result = createPostSchema.safeParse(validPost);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe("VI");
    }
  });

  it("accepts linkWithId as optional string", () => {
    const result = createPostSchema.safeParse({
      ...validPost,
      language: "EN",
      linkWithId: "post-123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.linkWithId).toBe("post-123");
    }
  });

  it("allows omitting linkWithId", () => {
    const result = createPostSchema.safeParse(validPost);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.linkWithId).toBeUndefined();
    }
  });
});
