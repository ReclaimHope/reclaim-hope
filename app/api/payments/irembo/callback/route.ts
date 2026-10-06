import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  verifyIremboWebhookSignature,
  fetchIremboInvoiceDetails,
  parseIremboDate,
} from "@/lib/payments/iremboPay";
import { getSponsorshipPeriodDays } from "@/lib/sponsorship-plans";

/**
 * Official IremboPay Webhook Callback Endpoint
 *
 * Requirements:
 * - Must consume the raw body text for signature verification before parsing JSON.
 * - Header: irembopay-signature (contains t=<timestamp>, s=<signature>).
 * - Verifies HMAC SHA-256 signature using the server secret key.
 * - Replay attack prevention (5-minute tolerance).
 * - Idempotency: Duplicate callbacks do not create duplicate donations or records.
 * - Validates invoice, transactionId, amount, and currency.
 * - Transitions Payment: PENDING -> SUCCESSFUL
 * - Transitions Donation: PENDING -> COMPLETED
 * - Activates Sponsorship: PENDING -> ACTIVE (coverage period from now)
 */
export async function POST(request: NextRequest) {
  try {
    // Phase 8: Preserve RAW callback body
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("irembopay-signature");

    console.log("[IremboPay Webhook] Incoming callback received.");

    // Phase 9: Signature Verification
    const verification = verifyIremboWebhookSignature(rawBody, signatureHeader);

    if (!verification.isValid) {
      console.error(
        `[IremboPay Webhook] Signature verification failed: ${verification.reason}`
      );
      return NextResponse.json(
        {
          success: false,
          error: verification.reason || "Invalid signature",
        },
        { status: 401 }
      );
    }

    // Parse verified payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("[IremboPay Webhook] JSON parse error:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const data = payload?.data || payload;
    const {
      invoiceNumber,
      transactionId,
      paymentReference,
      paymentStatus,
      amount,
      currency,
      paidAt,
    } = data || {};

    if (!invoiceNumber || !transactionId) {
      console.error(
        "[IremboPay Webhook] Missing essential invoiceNumber or transactionId:",
        data
      );
      return NextResponse.json(
        { success: false, error: "Missing invoiceNumber or transactionId" },
        { status: 400 }
      );
    }

    console.log(
      `[IremboPay Webhook] Verified notification for Invoice ${invoiceNumber}, Ref ${transactionId}, Status: ${paymentStatus}`
    );

    // Phase 10: Payment Verification against Database
    // We match by our internal payment reference (which was passed as transactionId to Irembo) or payment.id
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { reference: transactionId },
          { id: transactionId },
          { transactionId: invoiceNumber },
          { transactionId: paymentReference },
        ],
      },
      include: {
        donation: true,
        sponsorship: true,
      },
    });

    if (!payment) {
      console.error(
        `[IremboPay Webhook] No matching payment found in DB for transactionId: ${transactionId} or invoice: ${invoiceNumber}`
      );
      return NextResponse.json(
        { success: false, error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Phase 12: Idempotency Check
    if (payment.status === "SUCCESSFUL") {
      console.log(
        `[IremboPay Webhook] Payment ${payment.id} is already marked SUCCESSFUL. Skipping duplicate processing.`
      );
      return NextResponse.json(
        {
          success: true,
          message: "Payment already processed",
          paymentId: payment.id,
        },
        { status: 200 }
      );
    }

    // Verify Amount and Currency
    const expectedAmount = Number(payment.amount);
    const callbackAmount = Number(amount);

    if (Math.abs(expectedAmount - callbackAmount) > 0.01) {
      console.error(
        `[IremboPay Webhook] Amount mismatch: Expected ${expectedAmount}, received ${callbackAmount}`
      );
      return NextResponse.json(
        { success: false, error: "Payment amount mismatch" },
        { status: 400 }
      );
    }

    if (payment.currency.toUpperCase() !== String(currency).toUpperCase()) {
      console.error(
        `[IremboPay Webhook] Currency mismatch: Expected ${payment.currency}, received ${currency}`
      );
      return NextResponse.json(
        { success: false, error: "Payment currency mismatch" },
        { status: 400 }
      );
    }

    // If payment status from Irembo is NOT PAID
    const isPaid = String(paymentStatus).toUpperCase() === "PAID";

    if (!isPaid) {
      console.warn(
        `[IremboPay Webhook] Non-paid status received: ${paymentStatus}. Updating payment status accordingly.`
      );
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: paymentStatus === "CANCELLED" ? "CANCELLED" : "FAILED",
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: `Payment status updated to ${paymentStatus}`,
          paymentId: payment.id,
        },
        { status: 200 }
      );
    }

    // Optionally cross-verify status via official IremboPay API if reachable
    try {
      const verifiedDetails = await fetchIremboInvoiceDetails(invoiceNumber);
      if (verifiedDetails && verifiedDetails.paymentStatus.toUpperCase() !== "PAID") {
        console.warn(
          `[IremboPay Webhook] API status check returned non-PAID: ${verifiedDetails.paymentStatus}`
        );
        return NextResponse.json(
          { success: false, error: "Payment status not verified with IremboPay API" },
          { status: 400 }
        );
      }
    } catch (apiVerifyErr) {
      console.warn(
        "[IremboPay Webhook] Could not reach IremboPay status API; relying on verified webhook signature:",
        apiVerifyErr
      );
    }

    // Phase 11: Atomic Database Update
    const paidAtDate = parseIremboDate(paidAt);
    const finalTxnId = paymentReference || invoiceNumber;

    await prisma.$transaction(async (tx) => {
      // Payment: PENDING -> SUCCESSFUL
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESSFUL",
          paidAt: paidAtDate,
          transactionId: finalTxnId,
        },
      });

      // Donation: PENDING -> COMPLETED (Donation only!)
      if (payment.donationId) {
        await tx.donation.update({
          where: { id: payment.donationId },
          data: {
            status: "COMPLETED",
          },
        });
      }

      // Sponsorship: PENDING -> ACTIVE with coverage period (one-time payment)
      if (payment.sponsorshipId && payment.sponsorship) {
        const periodDays = getSponsorshipPeriodDays(
          payment.sponsorship.frequency as "MONTHLY" | "YEARLY",
        );
        const endedAt = new Date(paidAtDate);
        endedAt.setDate(endedAt.getDate() + periodDays);
        await tx.sponsorship.update({
          where: { id: payment.sponsorshipId },
          data: {
            status: "ACTIVE",
            startedAt: paidAtDate,
            endedAt,
          },
        });
      }
    });

    console.log(
      `[IremboPay Webhook] Successfully processed Payment ${payment.id} (Donation ${payment.donationId || "-"}, Sponsorship ${payment.sponsorshipId || "-"})`
    );

    revalidatePath("/donate");
    revalidatePath("/sponsor");
    revalidatePath("/admin/donations");
    revalidatePath("/admin/sponsors");
    revalidatePath("/admin/payments");

    return NextResponse.json(
      {
        success: true,
        message: "Payment successfully verified and completed",
        paymentId: payment.id,
        donationId: payment.donationId,
        sponsorshipId: payment.sponsorshipId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[IremboPay Webhook] Uncaught error handling callback:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
