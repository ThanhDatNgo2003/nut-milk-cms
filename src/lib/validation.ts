import { z } from "zod";
import { generateSlug } from "./utils";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(160).optional(),
  categoryId: z.string().min(1, "Category is required"),
  featuredImage: z.string().url().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Invalid image URL"),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(160).optional(),
  categoryId: z.string().min(1, "Category is required"),
  tagIds: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(),
  language: z.enum(["VI", "EN"]).optional().default("VI"),
  linkWithId: z.string().optional(),
}).transform((data) => ({
  ...data,
  slug: data.slug || generateSlug(data.title),
}));

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  image: z.string().min(1, "Main image is required"),
  images: z.array(z.string()).optional().default([]),
  category: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  variants: z.array(z.object({
    size: z.string().min(1, "Size is required"),
    price: z.number().positive("Variant price must be positive"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
  })).optional().default([]),
  isFeatured: z.boolean().optional().default(false),
  featuredPosition: z.number().int().min(1).max(3).optional(),
  featuredLabel: z.string().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).optional(),
  language: z.enum(["VI", "EN"]).optional().default("VI"),
}).transform((data) => ({
  ...data,
  slug: data.slug || generateSlug(data.name),
}));

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
