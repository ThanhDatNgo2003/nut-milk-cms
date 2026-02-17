"use client";

import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, X, Star } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageGalleryProps {
  mainImage: string;
  images: string[];
  onMainImageChange: (url: string) => void;
  onImagesChange: (urls: string[]) => void;
}

export default function ImageGallery({
  mainImage,
  images,
  onMainImageChange,
  onImagesChange,
}: ImageGalleryProps) {
  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }
      return res.json();
    },
  });

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadImage.mutateAsync(file);
      onMainImageChange(result.data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
    if (mainInputRef.current) mainInputRef.current.value = "";
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      try {
        const result = await uploadImage.mutateAsync(file);
        onImagesChange([...images, result.data.url]);
        toast.success(`${file.name} uploaded`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Failed to upload ${file.name}`);
      }
    }
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const setAsMain = (url: string) => {
    const oldMain = mainImage;
    onMainImageChange(url);
    // Move old main to gallery, remove new main from gallery
    const newImages = images.filter((img) => img !== url);
    if (oldMain) newImages.push(oldMain);
    onImagesChange(newImages);
  };

  const removeGalleryImage = (url: string) => {
    onImagesChange(images.filter((img) => img !== url));
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="space-y-2">
        <Label>Main Image</Label>
        {mainImage ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image
              src={mainImage}
              alt="Main product"
              fill
              className="object-cover"
              sizes="320px"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-7 w-7 p-0"
              onClick={() => onMainImageChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => mainInputRef.current?.click()}
            className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <div className="text-center">
              <ImageIcon className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">Click to upload main image</p>
            </div>
          </button>
        )}
        <input
          ref={mainInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleMainImageUpload}
          className="hidden"
        />
      </div>

      {/* Gallery Images */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Gallery Images</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploadImage.isPending}
            className="h-7 text-xs"
          >
            {uploadImage.isPending ? "Uploading..." : "Add Images"}
          </Button>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {images.map((url, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-md"
              >
                <Image
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setAsMain(url)}
                    title="Set as main image"
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removeGalleryImage(url)}
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No additional images. Click &quot;Add Images&quot; to upload.
          </p>
        )}

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleGalleryUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
