import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Runs a query with one retry (handles transient network blips /
 * cold database wake-ups), falling back to a default so a single
 * failing count can't 500 the whole endpoint.
 */
async function safeCount(
  query: () => Promise<number>,
  label: string
): Promise<number> {
  try {
    return await query();
  } catch (firstError) {
    console.warn(`[attention] ${label} failed, retrying once:`, firstError);
    await new Promise((r) => setTimeout(r, 800));
    try {
      return await query();
    } catch (secondError) {
      console.error(`[attention] ${label} failed twice, defaulting to 0:`, secondError);
      return 0;
    }
  }
}

/**
 * Admin attention queue: counts of items needing admin action.
 * Used by the dashboard "Needs attention" strip and sidebar nav badges.
 * Never throws: degrades to zeros instead of breaking the dashboard.
 */
export async function GET() {
  try {
    const [pendingSponsorships, pendingDonations, unsponsoredChildren] =
      await Promise.all([
        safeCount(() => prisma.sponsorship.count({ where: { status: "PENDING" } }), "pendingSponsorships"),
        safeCount(() => prisma.donation.count({ where: { status: "PENDING" } }), "pendingDonations"),
        safeCount(
          () =>
            prisma.child.count({
              where: { sponsorships: { none: { status: "ACTIVE" } } },
            }),
          "unsponsoredChildren"
        ),
      ]);

    return NextResponse.json(
      { pendingSponsorships, pendingDonations, unsponsoredChildren },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching attention queue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch attention queue." },
      { status: 500 }
    );
  }
}
