"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useProduct, useUpdateProduct, useToggleFeatured } from "@/hooks/useProducts";
import VariantManager from "@/components/products/VariantManager";
import type { VariantInput } from "@/components/products/VariantManager";
import ImageGallery from "@/components/products/ImageGallery";
import LanguageSelector from "@/components/blog/LanguageSelector";
import SEOForm from "@/components/blog/SEOForm";
import FeaturedBadge from "@/components/products/FeaturedBadge";
import { getLanguageFlag } from "@/lib/i18n";
import type { SupportedLanguage } from "@/lib/i18n";
import type { ProductWithVariants } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Star, StarOff } from "lucide-react";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Inner form — rendered only after product data is loaded            */
/* ------------------------------------------------------------------ */
function EditProductForm({ product, id }: { product: ProductWithVariants; id: string }) {
  const router = useRouter();
  const updateProduct = useUpdateProduct();
  const toggleFeatured = useToggleFeatured();

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState<number>(product.price);
  const [image, setImage] = useState(product.image);
  const [images, setImages] = useState<string[]>(product.images || []);
  const [category, setCategory] = useState(product.category || "");
  const [tags, setTags] = useState<string[]>(product.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [variants, setVariants] = useState<VariantInput[]>(
    product.variants.map((v) => ({ size: v.size, price: v.price, stock: v.stock }))
  );
  const [slug, setSlug] = useState(product.slug);
  const [metaTitle, setMetaTitle] = useState(product.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(product.metaDescription || "");
  const [metaKeywords, setMetaKeywords] = useState<string[]>(product.metaKeywords || []);

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (!description.trim()) { toast.error("Description is required"); return; }
    if (!price || price <= 0) { toast.error("Price must be positive"); return; }
    if (!image) { toast.error("Main image is required"); return; }

    try {
      await updateProduct.mutateAsync({
        id,
        data: {
          name,
          slug: slug || generateSlug(name),
          description,
          price,
          image,
          images,
          category: category || undefined,
          tags,
          variants,
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
          metaKeywords: metaKeywords.length > 0 ? metaKeywords : undefined,
        },
      });
      toast.success("Product saved!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const handleToggleFeatured = async () => {
    try {
      await toggleFeatured.mutateAsync({
        id,
        isFeatured: !product.isFeatured,
      });
      toast.success(product.isFeatured ? "Product unfeatured" : "Product featured");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update featured status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                {getLanguageFlag(product.language as SupportedLanguage)} {product.language}
              </Badge>
              <FeaturedBadge
                isFeatured={product.isFeatured}
                position={product.featuredPosition}
                label={product.featuredLabel}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFeatured}
            disabled={toggleFeatured.isPending}
          >
            {product.isFeatured ? (
              <><StarOff className="mr-2 h-4 w-4" /> Unfeature</>
            ) : (
              <><Star className="mr-2 h-4 w-4" /> Feature</>
            )}
          </Button>
          <Button onClick={handleSave} disabled={updateProduct.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateProduct.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name..."
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Base Price (VND)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price === 0 ? "" : price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 150000"
                  min={0}
                />
              </div>
              <div className="rounded-lg border bg-card p-4">
                <VariantManager variants={variants} onChange={setVariants} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 rounded-lg border bg-card p-4">
                <Label>Language</Label>
                <LanguageSelector
                  value={product.language as SupportedLanguage}
                  onChange={() => {}}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Language cannot be changed after creation.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <ImageGallery
                  mainImage={image}
                  images={images}
                  onMainImageChange={setImage}
                  onImagesChange={setImages}
                />
              </div>

              <div className="space-y-2 rounded-lg border bg-card p-4">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Nut Milk"
                />
              </div>

              <div className="space-y-2 rounded-lg border bg-card p-4">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="text-sm"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} &times;
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="max-w-2xl">
            <SEOForm
              slug={slug}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              metaKeywords={metaKeywords}
              onSlugChange={setSlug}
              onMetaTitleChange={setMetaTitle}
              onMetaDescriptionChange={setMetaDescription}
              onMetaKeywordsChange={setMetaKeywords}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page wrapper — handles loading / not-found                         */
/* ------------------------------------------------------------------ */
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: productData, isLoading } = useProduct(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (!productData?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Product not found.</p>
        <Button asChild className="mt-4"><Link href="/products">Back to products</Link></Button>
      </div>
    );
  }

  return <EditProductForm product={productData.data} id={id} />;
}
