import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function getPool(): Pool {
  if (!globalForPrisma.pgPool) {
    // The pooled connection string is required; pg handles serverless
    // usage by opening connections on demand through the pooler.
    globalForPrisma.pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return globalForPrisma.pgPool;
}

function createClient(): PrismaClient {
  // Driver adapter: queries run over pg with no native query-engine
  // binary, so Vercel file-tracing cannot break production.
  const adapter = new PrismaPg(getPool());
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
