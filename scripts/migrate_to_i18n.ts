import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://nutmilk:password@localhost:5433/nutmilk_cms";

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting i18n data migration...");

  // 1. Set all posts to VI (explicit even though DB default handles it)
  const postResult = await prisma.post.updateMany({
    where: {},
    data: { language: "VI" },
  });
  console.log(`  Updated ${postResult.count} posts to language=VI`);

  // 2. Set all products to VI
  const productResult = await prisma.product.updateMany({
    where: {},
    data: { language: "VI" },
  });
  console.log(`  Updated ${productResult.count} products to language=VI`);

  // 3. Ensure settings has language=VI
  const settingsResult = await prisma.settings.updateMany({
    where: {},
    data: { language: "VI" },
  });
  console.log(`  Updated ${settingsResult.count} settings rows to language=VI`);

  console.log("\ni18n data migration complete.");
  console.log("All existing content has been marked as Vietnamese (VI).");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("Migration failed:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
