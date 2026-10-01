import { NextRequest, NextResponse } from "next/server";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "@/lib/prisma";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

/**
 * Checks the well-known engine locations inside the running lambda.
 * Tells us whether file-tracing packaged the binary or not.
 */
function probeEngine(): Record<string, string[] | boolean> {
  const candidates = [
    "/var/task/lib/generated/prisma",
    "/var/task/.prisma/client",
    join(process.cwd(), "lib/generated/prisma"),
  ];
  const result: Record<string, string[] | boolean> = {};
  for (const dir of candidates) {
    try {
      result[dir] = existsSync(dir) ? readdirSync(dir) : false as unknown as string[];
    } catch {
      result[dir] = false as unknown as string[];
    }
  }
  return result;
}

/**
 * TEMPORARY diagnostic: tests the production database connection and
 * returns the exact error. Requires admin login. Delete after debugging.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const rawUrl = process.env.DATABASE_URL || "";
  // Never expose credentials: show only host + presence info.
  let host = "MISSING";
  try {
    host = rawUrl ? new URL(rawUrl).host : "MISSING";
  } catch {
    host = "MALFORMED_URL";
  }
  const diagnostics = {
    rev: "engine-fs-probe",
    databaseUrlPresent: String(!!rawUrl),
    databaseHost: host,
    nodeEnv: process.env.NODE_ENV || "unknown",
    // Does the query-engine binary exist inside the running lambda?
    engineProbe: probeEngine(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, diagnostics }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
        diagnostics,
      },
      { status: 500 }
    );
  }
}
