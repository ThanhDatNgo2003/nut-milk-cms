-- CreateEnum
CREATE TYPE "Language" AS ENUM ('VI', 'EN');

-- AlterTable: Post - add language and translation fields
ALTER TABLE "Post" ADD COLUMN "language" "Language" NOT NULL DEFAULT 'VI';
ALTER TABLE "Post" ADD COLUMN "translationGroupId" TEXT;

-- Drop old unique constraint on Post.slug and add composite unique
ALTER TABLE "Post" DROP CONSTRAINT "Post_slug_key";
ALTER TABLE "Post" ADD CONSTRAINT "Post_slug_language_key" UNIQUE ("slug", "language");

-- Add self-referential foreign key for translation group
ALTER TABLE "Post" ADD CONSTRAINT "Post_translationGroupId_fkey" FOREIGN KEY ("translationGroupId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add indexes for Post
CREATE INDEX "Post_language_idx" ON "Post"("language");
CREATE INDEX "Post_translationGroupId_idx" ON "Post"("translationGroupId");

-- AlterTable: Product - add language and translation fields
ALTER TABLE "Product" ADD COLUMN "language" "Language" NOT NULL DEFAULT 'VI';
ALTER TABLE "Product" ADD COLUMN "translationGroupId" TEXT;

-- Drop old unique constraint on Product.slug and add composite unique
ALTER TABLE "Product" DROP CONSTRAINT "Product_slug_key";
ALTER TABLE "Product" ADD CONSTRAINT "Product_slug_language_key" UNIQUE ("slug", "language");

-- Add indexes for Product
CREATE INDEX "Product_language_idx" ON "Product"("language");

-- AlterTable: Settings - change PK from fixed "main" to cuid, add language
-- First drop the existing row constraint and modify
ALTER TABLE "Settings" ADD COLUMN "language" "Language" NOT NULL DEFAULT 'VI';

-- Change the default id from "main" to use cuid (drop old default)
ALTER TABLE "Settings" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Add unique constraint on language (one settings per language)
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_language_key" UNIQUE ("language");
