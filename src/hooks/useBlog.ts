"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostWithRelations, PaginationParams, ApiResponse } from "@/types";

async function fetchPosts(params: PaginationParams): Promise<ApiResponse<PostWithRelations[]>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);

  const res = await fetch(`/api/blog?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export function usePosts(params: PaginationParams = {}) {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => fetchPosts(params),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
