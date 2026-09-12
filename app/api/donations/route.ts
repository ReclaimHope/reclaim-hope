import { Donor } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
type currency = "USD" | "RWF";

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
      { status: 500 },
    );
  }
}
const IremboPay = require("@irembo/irembopay-node-sdk").default;
const iPay = new IremboPay(
  process.env.IPAY_SECRET_KEY,
  process.env.IPAY_ENVIRONMENT,
);
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const email = data.get("email") as string;  
    const phoneNumber = data.get("phoneNumber") as string;
    const amount = Number(data.get("amount"));
    const currency = data.get("currency") as currency;
    const address = data.get("homeAddress") as string;

    console.log("Received donation data:", {
      firstName,
      lastName,
      email,
      phoneNumber,
      amount,
      currency,
      address,
    });
    const donor = await prisma.donor.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
      },
    });

    const donation = await prisma.donation.create({
      data: {
        amount,
        currency,
        donorId: donor.id,
      },
    });

   const invoiceData = await createIpayInvoice({ donor }, amount, currency, donation.id);

   console.log("Invoice Data:", invoiceData);

    return NextResponse.json(
      {
        success: true,
        invoiceNumber: invoiceData.invoiceNumber,
        paymentLinkUrl: invoiceData.paymentLinkUrl,
      },
      { status: 201 },
    );

  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create donation." },
      { status: 500 },
    );
  }
}
async function createIpayInvoice(
  { donor }: { donor: Donor },
  amount: number,
  currency: "USD" | "RWF",
  paymentId: string,
) {
  const paymentAccountIdentifier =
    currency === "RWF"
      ? process.env.IPAY_RWF_ACCOUNT_IDENTIFIER
      : process.env.IPAY_USD_ACCOUNT_IDENTIFIER;

  if (!paymentAccountIdentifier) {
    throw new Error(
      `IremboPay ${currency} account identifier is not configured.`,
    );
  }

  const invoice = (await iPay.invoice.createInvoice({
    transactionId: paymentId,
    paymentAccountIdentifier,
    customer: {
      email: donor?.email,
      phoneNumber: donor?.phoneNumber,
      name: donor?.firstName + " " + donor?.lastName,
    },
    paymentItems: [
      {
        unitAmount: amount,
        quantity: 1,
        code: currency === "RWF" ? process.env.IPAY_PRODUCT_IDENTIFIER_RWF : process.env.IPAY_PRODUCT_IDENTIFIER_USD,
      },
    ],
    description: `testing donations sandbox`,
    language: "EN",
  })) as { data: { invoiceNumber?: string; paymentLinkUrl?: string } };

  console.log("IremboPay Invoice Response:", invoice.data);
  return invoice.data;
}
