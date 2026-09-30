import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  createPendingDonation,
  DonationCategoryType,
} from "@/app/actions/donation";

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        donor: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = donations.map((d) => ({
      id: d.id,
      amount: Number(d.amount),
      currency: d.currency,
      category: d.category,
      status: d.status,
      createdAt: d.createdAt.toISOString(),
      donor: d.donor
        ? {
            id: d.donor.id,
            name: `${d.donor.firstName} ${d.donor.lastName}`.trim(),
            email: d.donor.email,
            phoneNumber: d.donor.phoneNumber,
            country: d.donor.country,
          }
        : null,
      latestPayment: d.payments[0]
        ? {
            id: d.payments[0].id,
            reference: d.payments[0].reference,
            status: d.payments[0].status,
            paidAt: d.payments[0].paidAt?.toISOString() || null,
          }
        : null,
      paymentsCount: d.payments.length,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donations." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let category: DonationCategoryType = "MEALS";
    let amount = 0;
    let currency: "USD" | "RWF" = "RWF";
    let firstName = "";
    let lastName = "";
    let email = "";
    let phoneNumber = "";
    let homeAddress = "";
    let message = "";
    let acceptedPolicy = false;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      category = (body.category || "MEALS") as DonationCategoryType;
      amount = Number(body.amount);
      currency = (body.currency || "RWF") as "USD" | "RWF";
      firstName = body.firstName || body.donor?.firstName || "";
      lastName = body.lastName || body.donor?.lastName || "";
      email = body.email || body.donor?.email || "";
      phoneNumber = body.phoneNumber || body.donor?.phoneNumber || "";
      homeAddress = body.homeAddress || body.address || body.donor?.address || "";
      message = body.message || body.donor?.message || "";
      acceptedPolicy = body.acceptedPolicy === true;
    } else {
      const data = await request.formData();
      category = (data.get("category") as DonationCategoryType) || "MEALS";
      amount = Number(data.get("amount"));
      currency = (data.get("currency") as "USD" | "RWF") || "RWF";
      firstName = (data.get("firstName") as string) || "";
      lastName = (data.get("lastName") as string) || "";
      email = (data.get("email") as string) || "";
      phoneNumber = (data.get("phoneNumber") as string) || "";
      homeAddress = (data.get("homeAddress") as string) || "";
      message = (data.get("message") as string) || "";
      acceptedPolicy = data.get("acceptedPolicy") === "true";
    }

    if (!acceptedPolicy) {
      return NextResponse.json(
        { success: false, error: "You must accept the Refund & Cancellation Policy before continuing." },
        { status: 400 }
      );
    }

    const result = await createPendingDonation({
      category,
      amount,
      currency,
      donor: {
        firstName,
        lastName,
        email,
        phoneNumber,
        address: homeAddress,
        message,
      },
    });

    if (!result.success || !result.payment) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to create donation" },
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
        donation: result.donation,
        payment: result.payment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating donation via API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create donation.",
      },
      { status: 500 }
    );
  }
}
