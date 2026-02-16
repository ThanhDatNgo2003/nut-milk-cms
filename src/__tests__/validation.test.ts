import { loginSchema, registerSchema, postSchema, productSchema } from "@/lib/validation";

describe("loginSchema", () => {
  it("validates a correct login input", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty fields", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("validates a correct registration input", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "john@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "invalid",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("postSchema", () => {
  it("validates a correct post input", () => {
    const result = postSchema.safeParse({
      title: "Test Post",
      slug: "test-post",
      content: "This is a test post content.",
      categoryId: "cat-123",
    });
    expect(result.success).toBe(true);
  });

  it("validates with optional fields", () => {
    const result = postSchema.safeParse({
      title: "Test Post",
      slug: "test-post",
      content: "Content here.",
      categoryId: "cat-123",
      excerpt: "Short excerpt",
      metaTitle: "Meta Title",
      metaDescription: "Meta description",
      metaKeywords: ["keyword1", "keyword2"],
      status: "PUBLISHED",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = postSchema.safeParse({
      title: "",
      slug: "test-post",
      content: "Content",
      categoryId: "cat-123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = postSchema.safeParse({
      title: "Test",
      slug: "test",
      content: "Content",
      categoryId: "cat-123",
      status: "INVALID_STATUS",
    });
    expect(result.success).toBe(false);
  });
});

describe("productSchema", () => {
  it("validates a correct product input", () => {
    const result = productSchema.safeParse({
      name: "Almond Milk",
      slug: "almond-milk",
      description: "Fresh almond milk",
      price: 50000,
      image: "https://example.com/image.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative price", () => {
    const result = productSchema.safeParse({
      name: "Almond Milk",
      slug: "almond-milk",
      description: "Fresh almond milk",
      price: -100,
      image: "https://example.com/image.jpg",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid image URL", () => {
    const result = productSchema.safeParse({
      name: "Almond Milk",
      slug: "almond-milk",
      description: "Fresh almond milk",
      price: 50000,
      image: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
