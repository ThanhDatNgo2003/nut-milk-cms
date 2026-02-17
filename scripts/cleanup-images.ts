/**
 * Standalone script to delete orphaned images from /public/uploads/.
 *
 * Usage:
 *   npx tsx scripts/cleanup-images.ts          # dry-run (shows what would be deleted)
 *   npx tsx scripts/cleanup-images.ts --delete  # actually delete files
 *
 * Requires DATABASE_URL environment variable to be set.
 */

import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { deleteUnusedImages } from "../src/lib/storage-cleanup";

const dryRun = !process.argv.includes("--delete");

async function main() {
  console.log(`\n=== Image Cleanup ${dryRun ? "(DRY RUN)" : "(DELETE MODE)"} ===\n`);

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("ERROR: DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as never);

  try {
    const result = await deleteUnusedImages(prisma as never, dryRun);

    console.log(`\nResults:`);
    console.log(`  Referenced (kept): ${result.kept.length} files`);
    console.log(`  Orphaned ${dryRun ? "(would delete)" : "(deleted)"}: ${result.deleted.length} files`);

    if (result.deleted.length > 0) {
      console.log(`\n  ${dryRun ? "Would delete" : "Deleted"}:`);
      for (const f of result.deleted) {
        console.log(`    - ${f}`);
      }
    }

    if (result.errors.length > 0) {
      console.log(`\n  Errors:`);
      for (const e of result.errors) {
        console.log(`    - ${e}`);
      }
    }

    if (dryRun && result.deleted.length > 0) {
      console.log(`\n  Run with --delete flag to actually remove these files.`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
