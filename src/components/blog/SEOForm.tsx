"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SEOFormProps {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  slug: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onMetaKeywordsChange: (value: string[]) => void;
  onSlugChange: (value: string) => void;
}

export default function SEOForm({
  metaTitle,
  metaDescription,
  metaKeywords,
  slug,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onMetaKeywordsChange,
  onSlugChange,
}: SEOFormProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <h3 className="text-sm font-semibold">SEO Settings</h3>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="post-url-slug"
        />
        <p className="text-xs text-muted-foreground">
          Auto-generated from title. Edit to customize.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <span className={`text-xs ${metaTitle.length > 60 ? "text-destructive" : "text-muted-foreground"}`}>
            {metaTitle.length}/60
          </span>
        </div>
        <Input
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder="SEO title (defaults to post title)"
          maxLength={60}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <span className={`text-xs ${metaDescription.length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
            {metaDescription.length}/160
          </span>
        </div>
        <Textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder="SEO description for search engines"
          maxLength={160}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Keywords</Label>
        <Input
          id="metaKeywords"
          value={metaKeywords.join(", ")}
          onChange={(e) =>
            onMetaKeywordsChange(
              e.target.value.split(",").map((k) => k.trim()).filter(Boolean)
            )
          }
          placeholder="keyword1, keyword2, keyword3"
        />
        <p className="text-xs text-muted-foreground">Comma-separated keywords</p>
      </div>

      {(metaTitle || metaDescription) && (
        <div className="space-y-1 rounded border bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">Search Preview</p>
          <p className="text-sm font-medium text-blue-600 truncate">
            {metaTitle || "Post Title"}
          </p>
          <p className="text-xs text-green-700 truncate">
            nutmilk.vn/blog/{slug || "post-slug"}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {metaDescription || "Post description will appear here..."}
          </p>
        </div>
      )}
    </div>
  );
}
