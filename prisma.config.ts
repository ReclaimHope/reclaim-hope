import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

// .env exists locally but NOT on hosting platforms like Vercel, where env
// vars are injected directly. Only load the file when present — otherwise
// `prisma generate` (postinstall) crashes the production build.
if (existsSync(".env")) {
  loadEnvFile();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/reclaim_hope",
  },
});
