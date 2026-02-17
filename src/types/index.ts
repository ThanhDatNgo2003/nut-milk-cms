import type { User, Post, Product, Category, Tag, PostStatus, Role, Language } from "@prisma/client";

export type { User, Post, Product, Category, Tag, PostStatus, Role, Language };

export type PostWithRelations = Post & {
  author: Pick<User, "id" | "name" | "email">;
  category: Category;
  tags: Tag[];
  translations?: Array<{
    id: string;
    language: Language;
    title: string;
    slug: string;
    status: PostStatus;
  }>;
  translatedFrom?: {
    id: string;
    language: Language;
    title: string;
    slug: string;
  } | null;
};

export type ProductWithVariants = Product & {
  variants: {
    id: string;
    size: string;
    price: number;
    stock: number;
  }[];
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  total?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus;
  categoryId?: string;
  language?: Language;
}

export interface CategoryWithCount extends Category {
  _count: { posts: number };
}

export interface TagWithCount extends Tag {
  _count: { posts: number };
}

export interface PostListResponse {
  posts: PostWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductListResponse {
  products: ProductWithVariants[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  featured?: boolean;
  language?: Language;
}
