import { PrismaClient } from "./generated/prisma/client";


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Reuse a single client across invocations in ALL environments.
// Serverless functions freeze/thaw containers, so a global survives warm
// invocations. Creating a new PrismaClient per request (the old production
// behavior) opens a fresh connection pool each time and exhausts the
// database under concurrent load -> P2024 pool timeouts.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
