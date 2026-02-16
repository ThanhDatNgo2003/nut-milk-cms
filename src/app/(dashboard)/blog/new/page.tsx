"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCreatePost, useUploadImage, usePost } from "@/hooks/useBlog";
import LanguageSelector from "@/components/blog/LanguageSelector";
import type { SupportedLanguage } from "@/lib/i18n";
import { useCategories, useCreateCategory } from "@/hooks/useCategories";
import { useTags, useCreateTag } from "@/hooks/useTags";
import BlogEditor from "@/components/blog/BlogEditor";
import SEOForm from "@/components/blog/SEOForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Form initial values                                                */
/* ------------------------------------------------------------------ */
interface FormDefaults {
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
  selectedTagIds: string[];
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

const EMPTY_DEFAULTS: FormDefaults = {
  title: "",
  content: "",
  excerpt: "",
  categoryId: "",
  selectedTagIds: [],
  slug: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
};

/* ------------------------------------------------------------------ */
/*  Inner form — receives initial values as props so useState          */
/*  initialisers work correctly without useEffect.                     */
/* ------------------------------------------------------------------ */
function NewPostForm({
  defaults,
  language: initialLanguage,
  linkWithId,
}: {
  defaults: FormDefaults;
  language: SupportedLanguage;
  linkWithId: string | null;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createPost = useCreatePost();
  const uploadImage = useUploadImage();
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = useTags();
  const createCategory = useCreateCategory();
  const createTag = useCreateTag();

  const [title, setTitle] = useState(defaults.title);
  const [content, setContent] = useState(defaults.content);
  const [excerpt, setExcerpt] = useState(defaults.excerpt);
  const [categoryId, setCategoryId] = useState(defaults.categoryId);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(defaults.selectedTagIds);
  const [featuredImage, setFeaturedImage] = useState("");
  const [slug, setSlug] = useState(defaults.slug);
  const [metaTitle, setMetaTitle] = useState(defaults.metaTitle);
  const [metaDescription, setMetaDescription] = useState(defaults.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState<string[]>(defaults.metaKeywords);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadImage.mutateAsync(file);
      setFeaturedImage(result.data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const result = await createCategory.mutateAsync({ name: newCategoryName.trim() });
      setCategoryId(result.data.id);
      setNewCategoryName("");
      toast.success("Category created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create category");
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const result = await createTag.mutateAsync({ name: newTagName.trim() });
      setSelectedTagIds((prev) => [...prev, result.data.id]);
      setNewTagName("");
      toast.success("Tag created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create tag");
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!content.trim()) { toast.error("Content is required"); return; }
    if (!categoryId) { toast.error("Please select a category"); return; }

    try {
      const result = await createPost.mutateAsync({
        title,
        slug: slug || generateSlug(title),
        content,
        excerpt: excerpt || undefined,
        categoryId,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        featuredImage: featuredImage || undefined,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        metaKeywords: metaKeywords.length > 0 ? metaKeywords : undefined,
        status,
        language,
        linkWithId: linkWithId || undefined,
      });

      toast.success(status === "PUBLISHED" ? "Post published!" : "Draft saved!");
      router.push(`/blog/${result.data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save post");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {linkWithId ? "Translate Blog Post" : "New Blog Post"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave("DRAFT")} disabled={createPost.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {createPost.isPending ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={() => handleSave("PUBLISHED")} disabled={createPost.isPending}>
            <Eye className="mr-2 h-4 w-4" />
            {createPost.isPending ? "Publishing..." : "Publish"}
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
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter post title..." className="text-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary of the post (max 160 characters)" maxLength={160} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <BlogEditor content={content} onChange={setContent} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 rounded-lg border bg-card p-4">
                <Label>Language</Label>
                <LanguageSelector
                  value={language}
                  onChange={setLanguage}
                  disabled={!!linkWithId}
                />
                {linkWithId && (
                  <p className="text-xs text-muted-foreground">
                    Translating from source post
                  </p>
                )}
              </div>
              <div className="space-y-2 rounded-lg border bg-card p-4">
                <Label>Featured Image</Label>
                {featuredImage ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <Image src={featuredImage} alt="Featured" fill className="object-cover" sizes="320px" />
                    <Button variant="destructive" size="sm" className="absolute top-2 right-2 h-7 w-7 p-0" onClick={() => setFeaturedImage("")}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted/50 transition-colors">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                      <p className="text-sm">Click to upload</p>
                    </div>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFeaturedImageUpload} className="hidden" />
              </div>

              <div className="space-y-2 rounded-lg border bg-card p-4">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categoriesData?.data?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category" className="text-sm" onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()} />
                  <Button variant="outline" size="sm" onClick={handleCreateCategory} disabled={createCategory.isPending}>Add</Button>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border bg-card p-4">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1">
                  {tagsData?.data?.map((tag) => (
                    <Badge key={tag.id} variant={selectedTagIds.includes(tag.id) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleTag(tag.id)}>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="New tag" className="text-sm" onKeyDown={(e) => e.key === "Enter" && handleCreateTag()} />
                  <Button variant="outline" size="sm" onClick={handleCreateTag} disabled={createTag.isPending}>Add</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="max-w-2xl">
            <SEOForm slug={slug} metaTitle={metaTitle} metaDescription={metaDescription} metaKeywords={metaKeywords} onSlugChange={setSlug} onMetaTitleChange={setMetaTitle} onMetaDescriptionChange={setMetaDescription} onMetaKeywordsChange={setMetaKeywords} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page wrapper — waits for source post when translating              */
/* ------------------------------------------------------------------ */
export default function NewBlogPostPage() {
  const searchParams = useSearchParams();
  const linkWithId = searchParams.get("from");
  const initialLang = (searchParams.get("lang")?.toUpperCase() as SupportedLanguage) || "VI";

  // Fetch source post when translating (linkWithId present)
  const { data: sourcePostData, isLoading: sourceLoading } = usePost(linkWithId || "");

  // If translating, wait for source post to load before rendering form
  if (linkWithId && sourceLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  // Build defaults from source post (translation) or empty
  const defaults: FormDefaults = linkWithId && sourcePostData?.data
    ? {
        title: sourcePostData.data.title,
        content: sourcePostData.data.content,
        excerpt: sourcePostData.data.excerpt || "",
        categoryId: sourcePostData.data.categoryId,
        selectedTagIds: sourcePostData.data.tags.map((t) => t.id),
        slug: sourcePostData.data.slug,
        metaTitle: sourcePostData.data.metaTitle || "",
        metaDescription: sourcePostData.data.metaDescription || "",
        metaKeywords: sourcePostData.data.metaKeywords || [],
      }
    : EMPTY_DEFAULTS;

  return (
    <NewPostForm
      defaults={defaults}
      language={initialLang}
      linkWithId={linkWithId}
    />
  );
}
