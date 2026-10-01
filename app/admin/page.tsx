import { AdminOverview } from "@/components/admin-overview";
import { prisma } from "@/lib/prisma";

/**
 * Runs a query with one retry, falling back to a default. A transient DB
 * blip must degrade one dashboard card — never 500 the whole /admin page.
 */
async function safe<T>(label: string, fallback: T, query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (firstError) {
    console.warn(`[admin] ${label} failed, retrying once:`, firstError);
    await new Promise((r) => setTimeout(r, 800));
    try {
      return await query();
    } catch (secondError) {
      console.error(`[admin] ${label} failed twice, using fallback:`, secondError);
      return fallback;
    }
  }
}

export default async function AdminPage() {
  const [children, activeSponsorships, completedDonations, publishedNewsletters, reports, donationTotals, recentChildren, recentDonations, pendingSponsorships, pendingDonations, unsponsoredChildren] = await Promise.all([
    safe("children", 0, () => prisma.child.count()),
    safe("activeSponsorships", 0, () => prisma.sponsorship.count({ where: { status: "ACTIVE" } })),
    safe("completedDonations", 0, () => prisma.donation.count({ where: { status: "COMPLETED" } })),
    safe("publishedNewsletters", 0, () => prisma.newsletter.count({ where: { published: true } })),
    safe("reports", 0, () => prisma.report.count()),
    safe("donationTotals", { _sum: { amount: null } }, () => prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } })),
    safe("recentChildren", [], () => prisma.child.findMany({ select: { id: true, firstName: true, lastName: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 3 })),
    safe("recentDonations", [], () => prisma.donation.findMany({ select: { id: true, amount: true, currency: true, createdAt: true }, where: { status: "COMPLETED" }, orderBy: { createdAt: "desc" }, take: 3 })),
    safe("pendingSponsorships", 0, () => prisma.sponsorship.count({ where: { status: "PENDING" } })),
    safe("pendingDonations", 0, () => prisma.donation.count({ where: { status: "PENDING" } })),
    safe("unsponsoredChildren", 0, () => prisma.child.count({ where: { sponsorships: { none: { status: "ACTIVE" } } } })),
  ]);

  return <AdminOverview stats={{ children, activeSponsorships, completedDonations, publishedNewsletters, reports, completedDonationTotal: Number(donationTotals._sum.amount ?? 0) }} recentChildren={recentChildren} recentDonations={recentDonations.map((donation) => ({ ...donation, amount: Number(donation.amount) }))} attention={{ pendingSponsorships, pendingDonations, unsponsoredChildren }} />;
}
