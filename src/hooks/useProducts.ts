"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductWithVariants, ApiResponse } from "@/types";

export function useProducts(params: { featured?: boolean; limit?: number } = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async (): Promise<ApiResponse<ProductWithVariants[]>> => {
      const searchParams = new URLSearchParams();
      if (params.featured) searchParams.set("featured", "true");
      if (params.limit) searchParams.set("limit", String(params.limit));

      const res = await fetch(`/api/products?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
