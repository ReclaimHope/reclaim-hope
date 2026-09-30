import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getIremboConfig } from "@/lib/payments/iremboPay";

/**
 * Diagnostic Webhook Simulator (Development / Testing Only)
 * Allows generating a valid or intentionally invalid HMAC SHA-256 signature
 * and firing it against /api/payments/irembo/callback to verify behavior.
 */
export async function POST(request: NextRequest) {
  try {
    const config = getIremboConfig();
    const body = await request.json();

    const {
      invoiceNumber,
      transactionId,
      amount,
      currency,
      paymentStatus = "PAID",
      timestampSkewMs = 0, // e.g. 10 * 60 * 1000 for expired
      tamperSignature = false,
      tamperPayload = false,
    } = body;

    const payloadObj = {
      success: true,
      data: {
        amount: Number(amount),
        currency: currency || "RWF",
        invoiceNumber,
        transactionId,
        paymentStatus,
        paymentMethod: "MOMO_PUSH",
        paymentReference: `TST-REF-${Date.now()}`,
        paidAt: new Date().toISOString(),
        customer: {
          email: "donor.test@reclaimhope.rw",
          phoneNumber: "+250788123456",
          name: "Test Donor",
        },
      },
    };

    let rawBody = JSON.stringify(payloadObj);
    const timestamp = (Date.now() - timestampSkewMs).toString();

    // Prepare signed string: ${timestamp}#${rawPayload}
    const signedPayload = `${timestamp}#${rawBody}`;

    let signature = crypto
      .createHmac("sha256", config.secretKey)
      .update(signedPayload)
      .digest("hex");

    if (tamperSignature) {
      signature = "0000000000000000000000000000000000000000000000000000000000000000";
    }

    if (tamperPayload) {
      rawBody = JSON.stringify({ ...payloadObj, tampered: true });
    }

    const signatureHeader = `t=${timestamp},s=${signature}`;

    // Dispatch internally to /api/payments/irembo/callback
    const origin = request.nextUrl.origin;
    const callbackResponse = await fetch(`${origin}/api/payments/irembo/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "irembopay-signature": signatureHeader,
      },
      body: rawBody,
    });

    const callbackJson = await callbackResponse.json();

    return NextResponse.json({
      simulatorSent: {
        timestamp,
        signatureHeader,
        payload: payloadObj,
      },
      callbackResponse: {
        status: callbackResponse.status,
        data: callbackJson,
      },
    });
  } catch (error: any) {
    console.error("Webhook simulator error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
