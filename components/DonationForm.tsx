"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, Loader2, LockKeyhole, RefreshCw, HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { DonationCategoryType } from "@/app/actions/donation";

type Currency = "USD" | "RWF";
type PaymentState =
  | "idle"
  | "preparing"
  | "widget_opened"
  | "payment_in_progress"
  | "confirmation_pending"
  | "confirmed"
  | "failed"
  | "cancelled";

const CATEGORY_OPTIONS: { id: DonationCategoryType; label: string; description: string }[] = [
  { id: "MEALS", label: "Meals & Nutrition", description: "Provide hot, nutritious meals to children" },
  { id: "HEALTH", label: "Healthcare & Hygiene", description: "Medical checkups, medicine, and hygiene care" },
  { id: "EDUCATION", label: "Education & School Fees", description: "Tuition, uniforms, books, and scholastic materials" },
  { id: "LOVE_GIFT", label: "Love Gift", description: "General blessing where needed most (Custom amount)" },
];

export default function DonationForm() {
  const [category, setCategory] = useState<DonationCategoryType>("MEALS");
  const [amount, setAmount] = useState<string>("5000");
  const [currency, setCurrency] = useState<Currency>("RWF");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [paymentLinkBackup, setPaymentLinkBackup] = useState<string | null>(null);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const [donor, setDonor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    homeAddress: "",
    message: "",
  });

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const updateDonor = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setDonor((current) => ({ ...current, [name]: value }));
  };

  // Launch IremboPay inline JavaScript widget
  const launchWidget = (invNum: string, pubKey: string, ref: string) => {
    if (typeof window === "undefined" || !window.IremboPay) {
      toast.error("IremboPay payment widget is still loading. Please try again in a moment.");
      setPaymentState("idle");
      return;
    }

    setPaymentState("widget_opened");

    try {
      window.IremboPay.initiate({
        publicKey: pubKey,
        invoiceNumber: invNum,
        locale: window.IremboPay.locale?.EN || "EN",
        callback: (error: any, response: any) => {
          console.log("[DonationForm] IremboPay widget callback:", { error, response });

          if (error) {
            const code = error.code || response?.errors?.[0]?.code;
            const detail =
              error.message ||
              response?.errors?.[0]?.detail ||
              response?.message ||
              "Payment could not be completed.";
            console.error("[DonationForm] IremboPay widget error:", { code, detail, error, response });
            if (error.code === "USER_CANCELLED" || error.message?.includes("cancel")) {
              setPaymentState("cancelled");
              toast.info("Payment was cancelled.");
            } else {
              setPaymentState("failed");
              toast.error(
                code ? `Payment failed (${code}): ${detail}` : detail
              );
            }
          } else {
            // Widget reported completion. Now verify via server callback.
            setPaymentState("confirmation_pending");
            toast.success("Payment submitted! Confirming transaction with our server...");
            startStatusPolling(ref);
          }
        },
      });
    } catch (widgetError: any) {
      console.error("Failed to launch IremboPay widget:", widgetError);
      setPaymentState("failed");
      toast.error("Failed to open payment modal: " + widgetError.message);
    }
  };

  // Poll server to confirm that the server-side callback verified the transaction
  const startStatusPolling = (ref: string) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    let attempts = 0;
    const maxAttempts = 24; // 24 * 2.5s = 60s

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const response = await fetch(`/api/payments/status?reference=${encodeURIComponent(ref)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === "SUCCESSFUL") {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            setPaymentState("confirmed");
            toast.success("Thank you! Your donation has been confirmed.");
            return;
          }
          if (data.status === "FAILED" || data.status === "CANCELLED") {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            setPaymentState(data.status === "CANCELLED" ? "cancelled" : "failed");
            return;
          }
        }

        if (attempts >= maxAttempts) {
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          // If still pending after 60s, inform user we'll notify them via email
          setPaymentState("confirmation_pending");
          toast.info("Payment received! Final confirmation is processing in the background.");
        }
      } catch (err) {
        console.warn("Status poll error:", err);
      }
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    if (!donor.firstName.trim() || !donor.lastName.trim() || !donor.email.trim()) {
      toast.error("Please provide your first name, last name, and a valid email.");
      return;
    }

    if (!acceptedPolicy) {
      toast.error("Please accept the Refund & Cancellation Policy before continuing.");
      return;
    }

    setPaymentState("preparing");

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          amount: numericAmount,
          currency,
          firstName: donor.firstName.trim(),
          lastName: donor.lastName.trim(),
          email: donor.email.trim(),
          phoneNumber: donor.phoneNumber?.trim() || "",
          homeAddress: donor.homeAddress?.trim() || "",
          message: donor.message?.trim() || "",
          acceptedPolicy,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to initialize payment invoice.");
      }

      const invNum = result.invoiceNumber;
      const pubKey = result.publicKey;
      const ref = result.reference || result.payment?.reference;

      setInvoiceNumber(invNum);
      setPublicKey(pubKey);
      setPaymentReference(ref);
      setPaymentLinkBackup(result.paymentLinkUrl || null);

      toast.success("Invoice prepared. Launching secure payment widget...");

      // Open the IremboPay internal JavaScript widget
      launchWidget(invNum, pubKey, ref);
    } catch (error: any) {
      console.error("Donation submission error:", error);
      setPaymentState("failed");
      toast.error(error.message || "An error occurred while preparing your donation.");
    }
  };

  // Re-open widget if closed
  const handleReopenWidget = () => {
    if (invoiceNumber && publicKey && paymentReference) {
      launchWidget(invoiceNumber, publicKey, paymentReference);
    }
  };

  return (
    <section id="donation-form" className="bg-white py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[460px] px-4 sm:px-0">
        <div className="rounded-xl border border-[#c4daf8] bg-[#fbfdff] p-6 shadow-sm">
          {paymentState === "confirmed" ? (
            /* Success View */
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#003D5C]">
                Thank You for Your Generosity!
              </h2>
              <p className="text-sm text-slate-600">
                Your donation of{" "}
                <span className="font-semibold text-slate-900 font-mono">
                  {amount} {currency}
                </span>{" "}
                towards <span className="font-medium">{category.replace("_", " ")}</span> has been confirmed and successfully received.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-500">
                Invoice: {invoiceNumber} | Ref: {paymentReference}
              </div>
              <button
                type="button"
                onClick={() => {
                  setPaymentState("idle");
                  setInvoiceNumber(null);
                  setPaymentReference(null);
                }}
                className="inline-flex items-center justify-center px-4 py-2 bg-[#176ff0] hover:bg-[#0958ce] text-white text-sm font-semibold rounded-md transition"
              >
                Make Another Donation
              </button>
            </div>
          ) : (
            /* Donation Form View */
            <form onSubmit={handleSubmit} className="space-y-4 text-[#003D5C]">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <HeartHandshake className="w-5 h-5 text-[#176ff0]" />
                <h2 className="text-base font-bold text-[#003D5C]">
                  Make a One-Time Donation
                </h2>
              </div>

              {/* Donation Category */}
              <div>
                <label
                  htmlFor="donation-category"
                  className="mb-1.5 block text-[13px] font-medium"
                >
                  Donation Purpose <span className="text-rose-500">*</span>
                </label>
                <select
                  id="donation-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DonationCategoryType)}
                  className="h-10 w-full rounded-[4px] border border-[#9fc3ff] bg-[#eff5fc] px-3 text-xs outline-none focus:ring-2 focus:ring-[#0099CC]/30 font-medium"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  {CATEGORY_OPTIONS.find((c) => c.id === category)?.description}
                </p>
              </div>

              {/* Currency & Amount */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label
                    htmlFor="currency"
                    className="mb-1.5 block text-[13px] font-medium"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(event) =>
                      setCurrency(event.target.value as Currency)
                    }
                    className="h-11 w-full rounded-[4px] border border-[#9fc3ff] bg-[#eff5fc] px-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0099CC]/30"
                  >
                    <option value="RWF">RWF</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="donation-amount"
                    className="mb-1.5 block text-[13px] font-medium"
                  >
                    Amount <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex h-11 items-center rounded-[3px] border border-[#9fc3ff] bg-[#eff5fc] px-3 focus-within:ring-2 focus-within:ring-[#0099CC]/30">
                    <span className="mr-2 text-sm font-semibold text-slate-600">
                      {currency === "USD" ? "$" : "RWF"}
                    </span>
                    <input
                      id="donation-amount"
                      type="number"
                      min="1"
                      value={amount}
                      required
                      placeholder="Enter amount"
                      onChange={(event) => setAmount(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-sm font-mono text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Preset Amount Chips */}
              <div className="flex flex-wrap gap-1.5">
                {(currency === "RWF" ? ["2000", "5000", "10000", "25000"] : ["10", "25", "50", "100"]).map(
                  (val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`px-2.5 py-1 text-xs font-mono rounded border transition ${
                        amount === val
                          ? "bg-[#176ff0] text-white border-[#176ff0]"
                          : "bg-white text-slate-700 border-slate-200 hover:border-[#9fc3ff]"
                      }`}
                    >
                      {currency === "USD" ? `$${val}` : `${Number(val).toLocaleString()} RWF`}
                    </button>
                  )
                )}
              </div>

              {/* Donor Name */}
              <div className="grid grid-cols-2 gap-2">
                <Field
                  label="First Name"
                  name="firstName"
                  placeholder="First"
                  value={donor.firstName}
                  onChange={updateDonor}
                  required
                />
                <Field
                  label="Last Name"
                  name="lastName"
                  placeholder="Last"
                  value={donor.lastName}
                  onChange={updateDonor}
                  required
                />
              </div>

              {/* Email & Phone */}
              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={donor.email}
                onChange={updateDonor}
                required
              />

              <Field
                label="Mobile Phone Number (Momo / Contact)"
                name="phoneNumber"
                placeholder="+250 788 123 456"
                value={donor.phoneNumber}
                onChange={updateDonor}
              />

              {/* Address (Optional) */}
              <Field
                label="Home Address (Optional)"
                name="homeAddress"
                placeholder="City, Country"
                value={donor.homeAddress}
                onChange={updateDonor}
              />

              {/* Message */}
              <div>
                <label
                  htmlFor="donation-message"
                  className="mb-1.5 block text-[13px]"
                >
                  Message for children (Optional)
                </label>
                <textarea
                  id="donation-message"
                  name="message"
                  value={donor.message}
                  onChange={updateDonor}
                  placeholder="Leave words of encouragement..."
                  rows={2}
                  className="w-full resize-y rounded-[4px] border border-[#9fc3ff] bg-[#eff5fc] px-2 py-2 text-xs outline-none placeholder:text-[#aeb9c8] focus:ring-2 focus:ring-[#0099CC]/30"
                />
              </div>

              <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
                <input
                  type="checkbox"
                  required
                  checked={acceptedPolicy}
                  onChange={(event) => setAcceptedPolicy(event.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-[#176ff0]"
                />
                <span>
                  I have read and accept the{" "}
                  <a
                    href="/refund-cancellation-policy"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#176ff0] underline underline-offset-2 hover:text-[#0958ce]"
                  >
                    Refund &amp; Cancellation Policy
                  </a>
                  .
                </span>
              </label>

              {/* Submit Button with Dynamic Lifecycle States */}
              <button
                type="submit"
                disabled={paymentState === "preparing" || paymentState === "confirmation_pending"}
                className="h-11 w-full rounded-[4px] bg-[#176ff0] text-sm font-bold text-white transition hover:bg-[#0958ce] disabled:cursor-wait disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
              >
                {paymentState === "preparing" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Preparing secure payment...
                  </>
                ) : paymentState === "confirmation_pending" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming payment...
                  </>
                ) : (
                  <>
                    <LockKeyhole className="w-4 h-4" />
                    Donate with IremboPay
                  </>
                )}
              </button>

              {/* Status & Re-open notices */}
              {paymentState === "confirmation_pending" && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-amber-600" />
                  <span>
                    Your payment was submitted through the widget. Awaiting server confirmation...
                  </span>
                </div>
              )}

              {paymentState === "failed" && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Payment could not be completed.</span>
                  </div>
                  {invoiceNumber && (
                    <button
                      type="button"
                      onClick={handleReopenWidget}
                      className="font-semibold underline ml-2"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}

              {paymentState === "cancelled" && (
                <div className="p-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 flex items-center justify-between">
                  <span>Payment was cancelled.</span>
                  {invoiceNumber && (
                    <button
                      type="button"
                      onClick={handleReopenWidget}
                      className="font-semibold underline text-[#176ff0]"
                    >
                      Re-open Payment
                    </button>
                  )}
                </div>
              )}

              {invoiceNumber && (
                <p className="text-center text-xs text-[#1B7063] mt-2">
                  IremboPay Invoice: <span className="font-mono">{invoiceNumber}</span>.{" "}
                  <button
                    type="button"
                    onClick={handleReopenWidget}
                    className="font-semibold underline hover:text-[#0c473f]"
                  >
                    Re-open modal
                  </button>
                </p>
              )}

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                  <LockKeyhole className="w-3 h-3" />
                  Secure Rwandan Franc & USD checkout powered by IremboPay
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={`donation-${name}`} className="mb-1.5 block text-[13px]">
        {label}
        {required ? <span className="text-rose-500"> *</span> : ""}
      </label>
      <input
        id={`donation-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-9 w-full rounded-[4px] border border-[#9fc3ff] bg-[#eff5fc] px-2 text-xs outline-none placeholder:text-[#aeb9c8] focus:ring-2 focus:ring-[#0099CC]/30"
      />
    </div>
  );
}
