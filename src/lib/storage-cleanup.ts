import { unlink } from "fs/promises";
import path from "path";
import { listFiles, UPLOAD_DIR } from "./storage";

/**
 * Find and delete images in /uploads/ that are not referenced by any post or product.
 *
 * This function requires Prisma to be initialised, so it must be called from
 * a context that has access to the database (e.g. a Next.js API route, a
 * standalone script via prisma adapter, etc.).
 */
export async function deleteUnusedImages(
  prisma: {
    post: { findMany: (args: { select: Record<string, boolean> }) => Promise<{ featuredImage: string | null; thumbnailImage: string | null; content: string }[]> };
    product: { findMany: (args: { select: Record<string, boolean> }) => Promise<{ image: string; images: string[] }[]> };
  },
  dryRun = false
): Promise<{ deleted: string[]; kept: string[]; errors: string[] }> {
  const deleted: string[] = [];
  const kept: string[] = [];
  const errors: string[] = [];

  // 1. Get all files in uploads directory
  const allFiles = await listFiles();
  if (allFiles.length === 0) {
    return { deleted, kept, errors };
  }

  // 2. Collect every image URL referenced in the database
  const referencedUrls = new Set<string>();

  // Posts: featuredImage, thumbnailImage, and images embedded in content
  const posts = await prisma.post.findMany({
    select: { featuredImage: true, thumbnailImage: true, content: true },
  });

  for (const post of posts) {
    if (post.featuredImage) referencedUrls.add(post.featuredImage);
    if (post.thumbnailImage) referencedUrls.add(post.thumbnailImage);

    // Extract /uploads/... URLs from HTML content
    const urlMatches = post.content.matchAll(/\/uploads\/[a-zA-Z0-9._-]+/g);
    for (const match of urlMatches) {
      referencedUrls.add(match[0]);
    }
  }

  // Products: image and images array
  const products = await prisma.product.findMany({
    select: { image: true, images: true },
  });

  for (const product of products) {
    if (product.image) referencedUrls.add(product.image);
    for (const img of product.images) {
      referencedUrls.add(img);
    }
  }

  // 3. Compare — delete files that are NOT referenced
  for (const filename of allFiles) {
    const url = `/uploads/${filename}`;

    if (referencedUrls.has(url)) {
      kept.push(filename);
      continue;
    }

    if (dryRun) {
      deleted.push(filename);
      continue;
    }

    try {
      await unlink(path.join(UPLOAD_DIR, filename));
      deleted.push(filename);
      console.log(`[cleanup] deleted: ${filename}`);
    } catch (err) {
      const msg = `Failed to delete ${filename}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
      console.error(`[cleanup] ${msg}`);
    }
  }

  return { deleted, kept, errors };
}
