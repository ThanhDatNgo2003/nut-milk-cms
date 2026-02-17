import { createProductSchema } from "@/lib/validation";

describe("createProductSchema", () => {
  const validProduct = {
    name: "Almond Milk",
    description: "Fresh organic almond milk",
    price: 150000,
    image: "https://example.com/almond.jpg",
  };

  it("validates a product with all required fields", () => {
    const result = createProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Almond Milk");
      expect(result.data.price).toBe(150000);
      expect(result.data.language).toBe("VI");
      expect(result.data.images).toEqual([]);
      expect(result.data.tags).toEqual([]);
      expect(result.data.variants).toEqual([]);
      expect(result.data.isFeatured).toBe(false);
    }
  });

  it("auto-generates slug from name when slug is not provided", () => {
    const result = createProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("almond-milk");
    }
  });

  it("uses provided slug when given", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      slug: "custom-slug",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("custom-slug");
    }
  });

  it("rejects missing name", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing description", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      description: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      price: -100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero price", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing main image", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      image: "",
    });
    expect(result.success).toBe(false);
  });

  it("validates product with valid variants", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      variants: [
        { size: "250ml", price: 50000, stock: 100 },
        { size: "500ml", price: 90000, stock: 50 },
        { size: "1L", price: 150000, stock: 25 },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.variants).toHaveLength(3);
      expect(result.data.variants[0].size).toBe("250ml");
    }
  });

  it("rejects variant with negative stock", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      variants: [{ size: "250ml", price: 50000, stock: -1 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects variant with negative price", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      variants: [{ size: "250ml", price: -100, stock: 10 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects variant with empty size", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      variants: [{ size: "", price: 50000, stock: 10 }],
    });
    expect(result.success).toBe(false);
  });

  it("defaults language to VI", () => {
    const result = createProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe("VI");
    }
  });

  it("accepts EN language", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      language: "EN",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe("EN");
    }
  });

  it("rejects invalid language", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      language: "FR",
    });
    expect(result.success).toBe(false);
  });

  it("validates product with all optional fields", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      slug: "almond-milk",
      images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
      category: "Nut Milk",
      tags: ["organic", "vegan", "dairy-free"],
      variants: [{ size: "500ml", price: 90000, stock: 50 }],
      isFeatured: true,
      featuredPosition: 1,
      featuredLabel: "Best Seller",
      metaTitle: "Almond Milk - Best Seller",
      metaDescription: "Fresh organic almond milk made daily",
      metaKeywords: ["almond milk", "organic", "nut milk"],
      language: "VI",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isFeatured).toBe(true);
      expect(result.data.featuredPosition).toBe(1);
      expect(result.data.tags).toHaveLength(3);
      expect(result.data.images).toHaveLength(2);
    }
  });

  it("rejects featured position outside 1-3 range", () => {
    const resultTooHigh = createProductSchema.safeParse({
      ...validProduct,
      featuredPosition: 4,
    });
    expect(resultTooHigh.success).toBe(false);

    const resultTooLow = createProductSchema.safeParse({
      ...validProduct,
      featuredPosition: 0,
    });
    expect(resultTooLow.success).toBe(false);
  });

  it("rejects name exceeding 200 characters", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      name: "A".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("rejects meta title exceeding 60 characters", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      metaTitle: "A".repeat(61),
    });
    expect(result.success).toBe(false);
  });

  it("rejects meta description exceeding 160 characters", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      metaDescription: "A".repeat(161),
    });
    expect(result.success).toBe(false);
  });

  it("allows variant with zero stock", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      variants: [{ size: "250ml", price: 50000, stock: 0 }],
    });
    expect(result.success).toBe(true);
  });

  it("defaults images to empty array", () => {
    const result = createProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.images).toEqual([]);
    }
  });

  it("defaults isFeatured to false", () => {
    const result = createProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isFeatured).toBe(false);
    }
  });
});
