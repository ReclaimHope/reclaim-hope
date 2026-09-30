import { AdminOverview } from "@/components/admin-overview";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [children, activeSponsorships, completedDonations, publishedNewsletters, reports, donationTotals, recentChildren, recentDonations, pendingSponsorships, pendingDonations, unsponsoredChildren] = await Promise.all([
    prisma.child.count(),
    prisma.sponsorship.count({ where: { status: "ACTIVE" } }),
    prisma.donation.count({ where: { status: "COMPLETED" } }),
    prisma.newsletter.count({ where: { published: true } }),
    prisma.report.count(),
    prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
    prisma.child.findMany({ select: { id: true, firstName: true, lastName: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.donation.findMany({ select: { id: true, amount: true, currency: true, createdAt: true }, where: { status: "COMPLETED" }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.sponsorship.count({ where: { status: "PENDING" } }),
    prisma.donation.count({ where: { status: "PENDING" } }),
    prisma.child.count({ where: { sponsorships: { none: { status: "ACTIVE" } } } }),
  ]);

  return <AdminOverview stats={{ children, activeSponsorships, completedDonations, publishedNewsletters, reports, completedDonationTotal: Number(donationTotals._sum.amount ?? 0) }} recentChildren={recentChildren} recentDonations={recentDonations.map((donation) => ({ ...donation, amount: Number(donation.amount) }))} attention={{ pendingSponsorships, pendingDonations, unsponsoredChildren }} />;
}