import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

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
    rev: "adapter-1109697",
    databaseUrlPresent: String(!!rawUrl),
    databaseHost: host,
    nodeEnv: process.env.NODE_ENV || "unknown",
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
