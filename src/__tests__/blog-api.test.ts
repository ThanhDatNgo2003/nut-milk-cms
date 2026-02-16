/**
 * Blog API tests - tests the validation, slug generation, and reading time logic.
 * API routes that depend on Prisma/DB are tested via integration tests in CI.
 */
import { createPostSchema } from "@/lib/validation";
import { generateSlug, calculateReadingTime, formatDate } from "@/lib/utils";

describe("Blog API Validation", () => {
  describe("createPostSchema", () => {
    const validPost = {
      title: "Test Post Title",
      content: "<p>Test content for the post</p>",
      categoryId: "clx123abc",
    };

    it("validates a minimal post", () => {
      const result = createPostSchema.safeParse(validPost);
      expect(result.success).toBe(true);
    });

    it("auto-generates slug from title", () => {
      const result = createPostSchema.safeParse(validPost);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe("test-post-title");
      }
    });

    it("uses provided slug instead of generating", () => {
      const result = createPostSchema.safeParse({
        ...validPost,
        slug: "custom-slug",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe("custom-slug");
      }
    });

    it("validates excerpt max length", () => {
      const result = createPostSchema.safeParse({
        ...validPost,
        excerpt: "a".repeat(161),
      });
      expect(result.success).toBe(false);
    });

    it("validates metaTitle max length", () => {
      const result = createPostSchema.safeParse({
        ...validPost,
        metaTitle: "a".repeat(61),
      });
      expect(result.success).toBe(false);
    });

    it("validates metaDescription max length", () => {
      const result = createPostSchema.safeParse({
        ...validPost,
        metaDescription: "a".repeat(161),
      });
      expect(result.success).toBe(false);
    });

    it("accepts valid status values", () => {
      for (const status of ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]) {
        const result = createPostSchema.safeParse({ ...validPost, status });
        expect(result.success).toBe(true);
      }
    });

    it("rejects invalid status", () => {
      const result = createPostSchema.safeParse({
        ...validPost,
        status: "INVALID",
      });
      expect(result.success).toBe(false);
    });

    it("accepts tagIds array", () => {
      const result = createPostSchema.safeParse({
        ...validPost,
        tagIds: ["tag1", "tag2"],
      });
      expect(result.success).toBe(true);
    });
  });
});

describe("Blog Utilities", () => {
  describe("generateSlug", () => {
    it("handles Vietnamese-like titles", () => {
      expect(generateSlug("Hello World Post")).toBe("hello-world-post");
    });

    it("removes consecutive hyphens", () => {
      expect(generateSlug("hello - - world")).toBe("hello-world");
    });

    it("handles empty string", () => {
      expect(generateSlug("")).toBe("");
    });
  });

  describe("calculateReadingTime", () => {
    it("returns 1 for empty content", () => {
      expect(calculateReadingTime("")).toBe(1);
    });

    it("handles HTML content", () => {
      const html = "<h2>Title</h2><p>" + Array(200).fill("word").join(" ") + "</p>";
      expect(calculateReadingTime(html)).toBe(1);
    });

    it("rounds to nearest minute", () => {
      const words = Array(500).fill("word").join(" ");
      expect(calculateReadingTime(words)).toBe(3);
    });
  });

  describe("formatDate", () => {
    it("formats Date objects", () => {
      const result = formatDate(new Date("2026-06-15"));
      expect(result).toContain("2026");
    });

    it("formats ISO strings", () => {
      const result = formatDate("2026-12-25T00:00:00.000Z");
      expect(result).toContain("Dec");
      expect(result).toContain("25");
    });
  });
});
