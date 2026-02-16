import type { User, Post, Product, Category, Tag, PostStatus, Role } from "@prisma/client";

export type { User, Post, Product, Category, Tag, PostStatus, Role };

export type PostWithRelations = Post & {
  author: Pick<User, "id" | "name" | "email">;
  category: Category;
  tags: Tag[];
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
