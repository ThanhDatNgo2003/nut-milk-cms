"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePost } from "@/hooks/useBlog";
import { getOppositeLanguage } from "@/lib/i18n";
import type { SupportedLanguage } from "@/lib/i18n";

export default function TranslateBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: postData, isLoading } = usePost(id);

  useEffect(() => {
    if (postData?.data) {
      const post = postData.data;
      const targetLang = getOppositeLanguage(
        post.language as SupportedLanguage
      );
      router.replace(
        `/dashboard/blog/new?from=${id}&lang=${targetLang.toLowerCase()}`
      );
    }
  }, [postData, id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">
            Preparing translation...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
