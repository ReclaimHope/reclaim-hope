import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatusAction } from "@/app/actions/donation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ref =
      searchParams.get("reference") ||
      searchParams.get("invoiceNumber") ||
      searchParams.get("paymentId");

    if (!ref) {
      return NextResponse.json(
        { success: false, error: "Missing reference, invoiceNumber, or paymentId query parameter" },
        { status: 400 }
      );
    }

    const result = await getPaymentStatusAction(ref);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error("Error in /api/payments/status:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
