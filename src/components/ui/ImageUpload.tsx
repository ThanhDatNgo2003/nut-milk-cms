"use client";

import { useState, useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  /** Called with the uploaded image URL on success */
  onUpload: (url: string) => void;
  /** Optional: called when the modal/component should close */
  onClose?: () => void;
  /** Accepted file types */
  accept?: string;
  /** Max file size in bytes (default 5MB) */
  maxSize?: number;
  /** Additional class name */
  className?: string;
}

export default function ImageUpload({
  onUpload,
  onClose,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  maxSize = 5 * 1024 * 1024,
  className,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
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

  const validateAndPreview = useCallback(
    (file: File) => {
      setError(null);
      setUploadedUrl(null);

      // Validate type
      const allowed = accept.split(",").map((t) => t.trim());
      if (!allowed.includes(file.type)) {
        setError(`Invalid file type. Allowed: ${allowed.map((t) => t.split("/")[1]).join(", ")}`);
        return;
      }

      // Validate size
      if (file.size > maxSize) {
        setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
        return;
      }

      setSelectedFile(file);

      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [accept, maxSize]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) validateAndPreview(file);
    },
    [validateAndPreview]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndPreview(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [validateAndPreview]
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadMutation.mutateAsync(selectedFile);
      setUploadedUrl(result.data.url);
      onUpload(result.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleReset = () => {
    setPreview(null);
    setSelectedFile(null);
    setUploadedUrl(null);
    setError(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      {!preview && !uploadedUrl && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">
            {dragActive ? "Drop image here" : "Drag & drop an image here"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            JPEG, PNG, WebP, GIF up to {(maxSize / 1024 / 1024).toFixed(0)}MB
          </p>
        </div>
      )}

      {/* Preview */}
      {preview && !uploadedUrl && (
        <div className="space-y-3">
          <div className="relative mx-auto w-[200px] h-[200px] rounded-lg overflow-hidden border bg-muted">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0"
              onClick={handleReset}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {selectedFile && (
            <div className="text-center text-sm text-muted-foreground">
              <p className="font-medium text-foreground truncate max-w-[250px] mx-auto">
                {selectedFile.name}
              </p>
              <p>{formatSize(selectedFile.size)}</p>
            </div>
          )}

          {/* Upload progress / button */}
          {uploadMutation.isPending ? (
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading...
              </p>
            </div>
          ) : (
            <div className="flex gap-2 justify-center">
              <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleUpload}>
                <Upload className="mr-1 h-3 w-3" />
                Upload
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Success */}
      {uploadedUrl && (
        <div className="space-y-3">
          <div className="relative mx-auto w-[200px] h-[200px] rounded-lg overflow-hidden border bg-muted">
            <Image
              src={uploadedUrl}
              alt="Uploaded"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Image uploaded successfully
          </div>
          <div className="flex gap-2 justify-center">
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              Upload another
            </Button>
            {onClose && (
              <Button type="button" size="sm" onClick={onClose}>
                Done
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
