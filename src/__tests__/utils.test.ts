import { generateSlug, calculateReadingTime, formatDate } from "@/lib/utils";

describe("generateSlug", () => {
  it("converts title to lowercase kebab-case", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(generateSlug("Hello, World! How's it?")).toBe("hello-world-hows-it");
  });

  it("trims leading/trailing hyphens", () => {
    expect(generateSlug("  Hello World  ")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(generateSlug("Hello---World")).toBe("hello-world");
  });
});

describe("calculateReadingTime", () => {
  it("returns 1 min for short content", () => {
    expect(calculateReadingTime("Short text")).toBe(1);
  });

  it("calculates based on 200 words per minute", () => {
    const words = Array(400).fill("word").join(" ");
    expect(calculateReadingTime(words)).toBe(2);
  });

  it("strips HTML tags before counting", () => {
    const html = "<p>Hello</p> <strong>world</strong> <a href='#'>link</a>";
    expect(calculateReadingTime(html)).toBe(1);
  });
});

describe("formatDate", () => {
  it("formats date string to readable format", () => {
    const result = formatDate("2026-01-15T00:00:00.000Z");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });
});
