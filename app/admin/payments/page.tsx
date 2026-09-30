import { prisma } from "@/lib/prisma";
import { PaymentsTable } from "@/components/payments-table";

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    select: {
      id: true,
      reference: true,
      transactionId: true,
      amount: true,
      currency: true,
      provider: true,
      status: true,
      paidAt: true,
      createdAt: true,
      donation: {
        select: {
          category: true,
          donor: { select: { firstName: true, lastName: true, email: true } },
        },
      },
      sponsorship: {
        select: {
          donor: { select: { firstName: true, lastName: true, email: true } },
          child: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const paymentRows = payments.map((payment) => {
    const donor = payment.donation?.donor ?? payment.sponsorship?.donor;
    const sponsorshipChild = payment.sponsorship?.child;

    return {
      id: payment.id,
      reference: payment.reference,
      transactionId: payment.transactionId,
      amount: Number(payment.amount),
      currency: payment.currency,
      provider: payment.provider,
      status: payment.status,
      paidAt: payment.paidAt?.toISOString() ?? null,
      createdAt: payment.createdAt.toISOString(),
      donor: donor ? {
        name: `${donor.firstName} ${donor.lastName}`.trim(),
        email: donor.email,
      } : null,
      source: payment.donation
        ? `Donation: ${payment.donation.category ? payment.donation.category.replace("_", " ") : "General"}`
        : sponsorshipChild
          ? `Sponsorship: ${sponsorshipChild.firstName} ${sponsorshipChild.lastName}`
          : "Unlinked payment",
    };
  });

  return <PaymentsTable payments={paymentRows} />;
}