"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Play,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { createPendingDonation, getPaymentStatusAction, DonationCategoryType } from "@/app/actions/donation";

interface StepStatus {
  step: number;
  title: string;
  status: "idle" | "running" | "success" | "error";
  detail?: string;
}

export default function PaymentTestPage() {
  const [category, setCategory] = useState<DonationCategoryType>("MEALS");
  const [amount, setAmount] = useState<number>(1000);
  const [currency, setCurrency] = useState<"RWF" | "USD">("RWF");
  const [donorName, setDonorName] = useState("Jean Baptiste");
  const [donorEmail, setDonorEmail] = useState("donor.test@reclaimhope.rw");
  const [donorPhone, setDonorPhone] = useState("+250788123456");

  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<string | null>(null);
  const [createdPaymentRef, setCreatedPaymentRef] = useState<string | null>(null);
  const [createdPublicKey, setCreatedPublicKey] = useState<string | null>(null);
  const [paymentLinkUrl, setPaymentLinkUrl] = useState<string | null>(null);
  const [widgetStatus, setWidgetStatus] = useState<string>("Not started");
  const [paymentDbStatus, setPaymentDbStatus] = useState<string | null>(null);
  const [donationDbStatus, setDonationDbStatus] = useState<string | null>(null);

  const [steps, setSteps] = useState<StepStatus[]>([
    { step: 1, title: "1. Create Donation & Payment in DB (PENDING)", status: "idle" },
    { step: 2, title: "2. Create IremboPay Invoice via API", status: "idle" },
    { step: 3, title: "3. Launch IremboPay JavaScript Widget", status: "idle" },
    { step: 4, title: "4. Receive Widget Callback (Frontend)", status: "idle" },
    { step: 5, title: "5. Server Callback & Signature Verification", status: "idle" },
    { step: 6, title: "6. Database Verified & Updated (SUCCESSFUL / COMPLETED)", status: "idle" },
  ]);

  const updateStep = (
    stepNum: number,
    status: "idle" | "running" | "success" | "error",
    detail?: string
  ) => {
    setSteps((prev) =>
      prev.map((s) => (s.step === stepNum ? { ...s, status, detail: detail ?? s.detail } : s))
    );
  };

  // Launch the end-to-end payment test flow
  const handleStartTest = async () => {
    setIsLoading(true);
    setCreatedInvoice(null);
    setCreatedPaymentRef(null);
    setPaymentDbStatus(null);
    setDonationDbStatus(null);
    setWidgetStatus("Initializing...");

    // Reset steps
    setSteps((prev) => prev.map((s) => ({ ...s, status: "idle", detail: undefined })));

    try {
      // Step 1 & 2: Call Server Action to create Donation, Payment, and Invoice
      updateStep(1, "running", "Creating pending DB records...");
      updateStep(2, "running", "Calling IremboPay API...");

      const [firstName, ...rest] = donorName.split(" ");
      const lastName = rest.join(" ") || "Donor";

      const res = await createPendingDonation({
        category,
        amount,
        currency,
        donor: {
          firstName,
          lastName,
          email: donorEmail,
          phoneNumber: donorPhone,
          address: "Kigali, Rwanda",
        },
      });

      if (!res.success || !res.payment) {
        updateStep(1, "error", res.error || "Failed to create donation");
        updateStep(2, "error", "Invoice creation aborted");
        toast.error(res.error || "Failed to initiate payment");
        setIsLoading(false);
        return;
      }

      const invoiceNum = res.payment.invoiceNumber;
      const pubKey = res.publicKey;
      const ref = res.payment.reference;

      setCreatedInvoice(invoiceNum);
      setCreatedPaymentRef(ref);
      setCreatedPublicKey(pubKey);
      setPaymentLinkUrl(res.payment.paymentLinkUrl || null);
      setPaymentDbStatus(res.payment.status);
      setDonationDbStatus(res.donation.status);

      updateStep(1, "success", `Donation ID: ${res.donation.id}, Ref: ${ref} (PENDING)`);
      updateStep(2, "success", `Invoice: ${invoiceNum}`);
      toast.success(`IremboPay Invoice created: ${invoiceNum}`);

      // Step 3: Launch IremboPay Widget
      updateStep(3, "running", "Checking window.IremboPay...");

      if (typeof window === "undefined" || !window.IremboPay) {
        updateStep(
          3,
          "error",
          "window.IremboPay is not loaded. Ensure inline.js script loaded from CDN."
        );
        toast.error("IremboPay widget script not loaded on page.");
        setIsLoading(false);
        return;
      }

      updateStep(3, "success", "Opening IremboPay inline widget modal...");
      setWidgetStatus("Widget opened. Waiting for donor payment...");

      // Invoke official widget
      window.IremboPay.initiate({
        publicKey: pubKey,
        invoiceNumber: invoiceNum,
        locale: window.IremboPay.locale?.EN || "EN",
        callback: async (error: any, response: any) => {
          console.log("[Test Page] Widget callback triggered:", { error, response });

          if (error) {
            updateStep(4, "error", `Widget reported error: ${JSON.stringify(error)}`);
            setWidgetStatus(`Error: ${error.message || "Payment cancelled or failed"}`);
            toast.error("Widget reported payment error or cancellation.");
          } else {
            updateStep(
              4,
              "success",
              `Widget success! Response: ${JSON.stringify(response || "OK")}`
            );
            setWidgetStatus("Widget reported success! Awaiting server-side verification...");
            toast.success("Widget reported payment completion. Verifying backend...");

            // Step 5 & 6: Poll for backend verification from webhook
            startPollingStatus(ref);
          }
        },
      });

      // Also start background polling in case donor finishes via USSD or external window
      startPollingStatus(ref);
    } catch (err: any) {
      console.error("Test error:", err);
      updateStep(1, "error", err.message);
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Poll database to check when the server callback arrives
  const startPollingStatus = (reference: string) => {
    setIsPolling(true);
    updateStep(5, "running", "Awaiting official webhook callback at /api/payments/irembo/callback...");
    updateStep(6, "running", "Waiting for database transition...");

    let attempts = 0;
    const maxAttempts = 30; // 30 * 2.5s = 75 seconds

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await getPaymentStatusAction(reference);

        if (res.success) {
          setPaymentDbStatus(res.status ?? null);
          setDonationDbStatus(res.donationStatus ?? null);

          if (res.status === "SUCCESSFUL") {
            clearInterval(interval);
            setIsPolling(false);
            updateStep(5, "success", "Server callback processed & signature verified!");
            updateStep(
              6,
              "success",
              `Database updated! Payment: SUCCESSFUL, Donation: COMPLETED (PaidAt: ${res.paidAt})`
            );
            setWidgetStatus("Payment confirmed and fully completed in database!");
            toast.success("Payment verified! Database updated to SUCCESSFUL.");
            return;
          }

          if (res.status === "FAILED" || res.status === "CANCELLED") {
            clearInterval(interval);
            setIsPolling(false);
            updateStep(5, "success", `Webhook processed: ${res.status}`);
            updateStep(6, "error", `Payment ended with status: ${res.status}`);
            setWidgetStatus(`Payment status: ${res.status}`);
            return;
          }
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setIsPolling(false);
          updateStep(
            5,
            "running",
            "Still PENDING. Ensure ngrok webhook URL is registered in Irembo portal."
          );
        }
      } catch (pollErr) {
        console.warn("Polling error:", pollErr);
      }
    }, 2500);
  };

  // Manual status check button
  const handleCheckStatus = async () => {
    if (!createdPaymentRef) return;
    try {
      const res = await getPaymentStatusAction(createdPaymentRef);
      if (res.success) {
        setPaymentDbStatus(res.status ?? null);
        setDonationDbStatus(res.donationStatus ?? null);
        toast.info(`Current status in DB: Payment = ${res.status}, Donation = ${res.donationStatus}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to check status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Phase 13
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Donation Scope Only
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-2">
                IremboPay Donation Integration Test Bench
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Isolated end-to-end verification tool: Form → API → Invoice → Widget → Callback → DB.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono block">Webhook Endpoint:</span>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                /api/payments/irembo/callback
              </code>
            </div>
          </div>
        </div>

        {/* Test Controls & Parameter Setup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuration Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-600" />
              1. Test Donation Parameters
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Donation Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DonationCategoryType)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MEALS">MEALS (Preset: 1,000 RWF)</option>
                <option value="HEALTH">HEALTH</option>
                <option value="EDUCATION">EDUCATION</option>
                <option value="LOVE_GIFT">LOVE_GIFT</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as "RWF" | "USD")}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                >
                  <option value="RWF">RWF</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Test Donor Name
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Phone (Momo)
                </label>
                <input
                  type="text"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleStartTest}
              disabled={isLoading || isPolling}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-sm transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Invoice & Opening Widget...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Launch Test Payment (1,000 RWF / MEALS)
                </>
              )}
            </button>
          </div>

          {/* Live Status & Data Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  Live Flow State
                </h2>
                {createdPaymentRef && (
                  <button
                    onClick={handleCheckStatus}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh Status
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Irembo Invoice:</span>
                  <span className="font-mono font-medium text-slate-800">
                    {createdInvoice || "Not generated yet"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Payment Reference:</span>
                  <span className="font-mono font-medium text-slate-800">
                    {createdPaymentRef || "Not generated yet"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Database Payment Status:</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-xs ${
                      paymentDbStatus === "SUCCESSFUL"
                        ? "bg-emerald-100 text-emerald-800"
                        : paymentDbStatus === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {paymentDbStatus || "None"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Database Donation Status:</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-xs ${
                      donationDbStatus === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : donationDbStatus === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {donationDbStatus || "None"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Widget State:</span>
                  <span className="font-medium text-slate-700">{widgetStatus}</span>
                </div>
              </div>
            </div>

            {paymentLinkUrl && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Direct Checkout Link (Backup):</span>
                <a
                  href={paymentLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-mono break-all"
                >
                  {paymentLinkUrl}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Real-time End-to-End Checklist Tracker */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            End-to-End Execution Sequence
          </h2>

          <div className="space-y-3">
            {steps.map((s) => (
              <div
                key={s.step}
                className={`p-3.5 rounded-lg border flex items-start gap-3 transition ${
                  s.status === "running"
                    ? "bg-blue-50 border-blue-200"
                    : s.status === "success"
                    ? "bg-emerald-50 border-emerald-200"
                    : s.status === "error"
                    ? "bg-rose-50 border-rose-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="mt-0.5">
                  {s.status === "running" && (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  )}
                  {s.status === "success" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {s.status === "error" && (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  {s.status === "idle" && (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        s.status === "running"
                          ? "text-blue-900"
                          : s.status === "success"
                          ? "text-emerald-900"
                          : s.status === "error"
                          ? "text-rose-900"
                          : "text-slate-600"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wider font-semibold ${
                        s.status === "running"
                          ? "text-blue-600"
                          : s.status === "success"
                          ? "text-emerald-600"
                          : s.status === "error"
                          ? "text-rose-600"
                          : "text-slate-400"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  {s.detail && (
                    <p
                      className={`text-xs mt-1 font-mono break-all ${
                        s.status === "error"
                          ? "text-rose-700"
                          : s.status === "success"
                          ? "text-emerald-700"
                          : "text-slate-600"
                      }`}
                    >
                      {s.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
