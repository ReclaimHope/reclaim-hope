import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createPendingSponsorship } from "@/app/actions/sponsorship";

export async function GET() {
  try {
    const sponsorships = await prisma.sponsorship.findMany({
      include: {
        donor: true,
        child: true,
        payments: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = sponsorships.map((s) => ({
      id: s.id,
      amount: Number(s.amount),
      currency: s.currency,
      frequency: s.frequency,
      status: s.status,
      subscriptionReference: s.subscriptionReference,
      requestedStartDate: s.requestedStartDate?.toISOString() || null,
      chargesCount: s.chargesCount,
      startedAt: s.startedAt?.toISOString() || null,
      endedAt: s.endedAt?.toISOString() || null,
      createdAt: s.createdAt.toISOString(),
      donor: {
        id: s.donor.id,
        name: `${s.donor.firstName} ${s.donor.lastName}`.trim(),
        email: s.donor.email,
        phoneNumber: s.donor.phoneNumber,
        country: s.donor.country,
        address: s.donor.address,
      },
      child: {
        id: s.child.id,
        name: `${s.child.firstName} ${s.child.lastName}`.trim(),
        dream: s.child.dream,
        imageUrl: s.child.imageUrl,
      },
      latestPayment: s.payments[0]
        ? {
            id: s.payments[0].id,
            reference: s.payments[0].reference,
            invoiceNumber: s.payments[0].transactionId,
            status: s.payments[0].status,
            paidAt: s.payments[0].paidAt?.toISOString() || null,
          }
        : null,
      paymentsCount: s.payments.length,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error fetching sponsorships:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sponsorships." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      childId,
      frequency,
      currency,
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      address,
      acceptedPolicy,
    } = body || {};

    if (!acceptedPolicy) {
      return NextResponse.json(
        { success: false, error: "You must accept the Refund & Cancellation Policy before continuing." },
        { status: 400 }
      );
    }

    if (!childId) {
      return NextResponse.json(
        { success: false, error: "Please select a child to sponsor." },
        { status: 400 }
      );
    }

    const result = await createPendingSponsorship({
      childId,
      frequency,
      currency,
      donor: {
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        phoneNumber: phoneNumber || "",
        country: country || "",
        address: address || "",
      },
    });

    if (!result.success || !result.payment) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to initiate sponsorship payment." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        invoiceNumber: result.payment.invoiceNumber,
        paymentLinkUrl: result.payment.paymentLinkUrl,
        publicKey: result.publicKey,
        environment: result.environment,
        paymentId: result.payment.id,
        reference: result.payment.reference,
        sponsorship: result.sponsorship,
        payment: result.payment,
        child: result.child,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating sponsorship via API:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to initiate sponsorship." },
      { status: 500 }
    );
  }
}
