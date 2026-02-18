"use client";

import { useState } from "react";
import Link from "next/link";
import { useProducts, useDeleteProduct, useToggleFeatured } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function ProductsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error } = useProducts({
    page,
    limit: 10,
    search: search || undefined,
    featured: featuredFilter === "featured" ? true : featuredFilter === "not_featured" ? false : undefined,
    language: languageFilter !== "all" ? (languageFilter as "VI" | "EN") : undefined,
  });

  const deleteProduct = useDeleteProduct();
  const toggleFeatured = useToggleFeatured();

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await toggleFeatured.mutateAsync({ id, isFeatured });
      toast.success(isFeatured ? "Product featured" : "Product unfeatured");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update featured status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success("Product deleted");
      setDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            {data?.total ?? 0} total products
          </p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" /> New Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={featuredFilter}
          onValueChange={(v) => {
            setFeaturedFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="not_featured">Not Featured</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={languageFilter}
          onValueChange={(v) => {
            setLanguageFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="VI">Vietnamese</SelectItem>
            <SelectItem value="EN">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load products. Please try again.</p>
        </div>
      ) : data?.products?.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No products found.</p>
          <Button asChild className="mt-4">
            <Link href="/products/new">Create your first product</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data?.products?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleFeatured={handleToggleFeatured}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
              All variants will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
