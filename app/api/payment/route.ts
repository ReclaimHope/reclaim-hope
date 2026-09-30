import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "IremboPay Payment Integration API",
    status: "active",
    callbackEndpoint: "/api/payments/irembo/callback",
  });
}