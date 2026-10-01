/**
 * Prisma loads its native query-engine binary from fixed candidate
 * directories. With a custom generator output (lib/generated/prisma) the
 * bundled layout makes it look in lib/generated/ (the PARENT), while
 * `prisma generate` places the binary inside lib/generated/prisma/.
 * This script copies the engine binary one level up so the loader finds it
 * in production. Run after every `prisma generate` (see postinstall).
 */
import { readdirSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "lib", "generated", "prisma");
const parentDir = join(process.cwd(), "lib", "generated");

if (!existsSync(outDir)) {
  console.log("[prisma-engine] output dir missing, skipping copy");
  process.exit(0);
}

const engines = readdirSync(outDir).filter(
  (f) => /^(lib)?query_engine.+\.node$/.test(f) && !f.includes(".tmp")
);

if (engines.length === 0) {
  console.log("[prisma-engine] no engine binary found, skipping copy");
  process.exit(0);
}

for (const file of engines) {
  copyFileSync(join(outDir, file), join(parentDir, file));
  console.log(`[prisma-engine] copied ${file} -> lib/generated/`);
}
