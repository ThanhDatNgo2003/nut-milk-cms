"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/hooks/useProducts";
import VariantManager from "@/components/products/VariantManager";
import type { VariantInput } from "@/components/products/VariantManager";
import ImageGallery from "@/components/products/ImageGallery";
import LanguageSelector from "@/components/blog/LanguageSelector";
import SEOForm from "@/components/blog/SEOForm";
import type { SupportedLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Star } from "lucide-react";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [variants, setVariants] = useState<VariantInput[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>("VI");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

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
      const result = await createProduct.mutateAsync({
        name,
        slug: slug || generateSlug(name),
        description,
        price,
        image,
        images,
        category: category || undefined,
        tags,
        variants,
        isFeatured,
        language,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        metaKeywords: metaKeywords.length > 0 ? metaKeywords : undefined,
      });

      toast.success("Product created!");
      router.push(`/products/${result.data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">New Product</h1>
        </div>
        <Button onClick={handleSave} disabled={createProduct.isPending}>
          <Save className="mr-2 h-4 w-4" />
          {createProduct.isPending ? "Saving..." : "Save Product"}
        </Button>
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
                  onChange={(e) => handleNameChange(e.target.value)}
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
                <LanguageSelector value={language} onChange={setLanguage} />
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

              <div className="space-y-2 rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <Label>Featured Product</Label>
                  <Button
                    type="button"
                    variant={isFeatured ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={isFeatured ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    <Star className={`mr-1 h-3.5 w-3.5 ${isFeatured ? "fill-current" : ""}`} />
                    {isFeatured ? "Featured" : "Not Featured"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Max 3 featured products. Featured products appear on the home page.
                </p>
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
