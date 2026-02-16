import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://nutmilk:password@localhost:5433/nutmilk_cms",
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
