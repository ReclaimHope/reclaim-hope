import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Admin attention queue: counts of items needing admin action.
 * Used by the dashboard "Needs attention" strip and sidebar nav badges.
 */
export async function GET() {
  try {
    const [pendingSponsorships, pendingDonations, unsponsoredChildren] =
      await Promise.all([
        prisma.sponsorship.count({ where: { status: "PENDING" } }),
        prisma.donation.count({ where: { status: "PENDING" } }),
        prisma.child.count({
          where: { sponsorships: { none: { status: "ACTIVE" } } },
        }),
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
