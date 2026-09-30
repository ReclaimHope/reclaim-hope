import crypto from "crypto";
import IremboPaySDK from "@irembo/irembopay-node-sdk";

interface IremboSdkClient {
  invoice: {
    createInvoice(data: unknown): Promise<unknown>;
    getInvoice(invoiceReference: string): Promise<unknown>;
  };
}

// Interop support for CommonJS / ESM
const IremboPayConstructor = ((IremboPaySDK as { default?: unknown }).default ||
  IremboPaySDK) as {
  new (apiKey: string, environment: string): IremboSdkClient;
};

export interface IremboConfig {
  environment: "sandbox" | "production";
  secretKey: string;
  publicKey: string;
  rwfAccountIdentifier: string;
  usdAccountIdentifier: string;
  rwfProductIdentifier: string;
  usdProductIdentifier: string;
  callbackUrl?: string;
  apiBaseUrl: string;
}

/**
 * Validates and retrieves server-side IremboPay configuration from environment variables.
 */
export function getIremboConfig(): IremboConfig {
  const secretKey = process.env.IPAY_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing server-side environment variable: IPAY_SECRET_KEY");
  }

  const publicKey =
    process.env.NEXT_PUBLIC_IPAY_PUBLIC_KEY || process.env.IPAY_PUBLIC_KEY || "";
  const environment = (process.env.IPAY_ENVIRONMENT || "sandbox").toLowerCase() as
    | "sandbox"
    | "production";

  const rwfAccountIdentifier = process.env.IPAY_RWF_ACCOUNT_IDENTIFIER || "";
  const usdAccountIdentifier = process.env.IPAY_USD_ACCOUNT_IDENTIFIER || "";
  const rwfProductIdentifier = process.env.IPAY_PRODUCT_IDENTIFIER_RWF || "";
  const usdProductIdentifier = process.env.IPAY_PRODUCT_IDENTIFIER_USD || "";
  const callbackUrl = process.env.IPAY_CALLBACK_URL;

  const apiBaseUrl =
    environment === "production"
      ? "https://api.irembopay.com/payments"
      : "https://api.sandbox.irembopay.com/payments";

  // Note: key prefixes (pk_live_/pk_test_) do NOT determine the environment.
  // The sandbox dashboard issues live-prefixed keys that only work against
  // the sandbox API, so no prefix-based validation is done here. What must
  // match is: keys + product/account identifiers all come from the same
  // dashboard (sandbox vs production) as IPAY_ENVIRONMENT.

  return {
    environment,
    secretKey,
    publicKey,
    rwfAccountIdentifier,
    usdAccountIdentifier,
    rwfProductIdentifier,
    usdProductIdentifier,
    callbackUrl,
    apiBaseUrl,
  };
}

/**
 * Normalizes a Rwandan mobile number to the 07XXXXXXXX format IremboPay
 * expects (e.g. "+250 788 123 456" -> "0788123456").
 * Returns undefined when no usable number was provided so we omit the
 * field instead of sending a malformed BAD_CUSTOMER_CONTACT value.
 */
export function normalizeRwPhoneNumber(input?: string | null): string | undefined {
  if (!input) return undefined;
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("250") && digits.length === 12) {
    digits = "0" + digits.slice(3);
  }
  if (/^07\d{8}$/.test(digits)) return digits;
  return undefined;
}

/**
 * Parses IremboPay timestamps robustly. IremboPay sometimes sends offsets
 * like "+02" (see their docs example "2023-04-19T11:58:02.895+02"), which
 * `new Date()` rejects as Invalid Date. Normalizes to "+02:00" and falls
 * back to now rather than crashing the Prisma update.
 */
export function parseIremboDate(value?: string | null): Date {
  if (!value) return new Date();
  const candidate = value.trim();
  const direct = new Date(candidate);
  if (!isNaN(direct.getTime())) return direct;
  const normalized = candidate
    .replace(/([+-]\d{2})$/, "$1:00")
    .replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
  const parsed = new Date(normalized);
  if (!isNaN(parsed.getTime())) return parsed;
  console.warn(`[IremboPay] Unparseable date "${value}", falling back to now.`);
  return new Date();
}

let cachedIpayInstance: IremboSdkClient | null = null;

function getIpayClient(): IremboSdkClient {
  if (!cachedIpayInstance) {
    const config = getIremboConfig();
    cachedIpayInstance = new IremboPayConstructor(config.secretKey, config.environment);
  }
  return cachedIpayInstance;
}

export interface CreateInvoiceParams {
  transactionId: string; // Unique internal reference (e.g. payment.reference or payment.id)
  amount: number;
  currency: "RWF" | "USD";
  description?: string;
  customer?: {
    name?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  };
}

export interface CreateInvoiceResult {
  invoiceNumber: string;
  paymentLinkUrl?: string;
  transactionId: string;
  amount: number;
  currency: string;
}

interface SdkInvoiceData {
  invoiceNumber?: string;
  paymentLinkUrl?: string;
  message?: string;
  transactionId?: string;
  paymentStatus?: string;
  amount?: number;
  currency?: string;
  paidAt?: string | null;
  paymentMethod?: string | null;
  paymentReference?: string | null;
}

/**
 * Creates an IremboPay invoice using the official server SDK and official API parameters.
 */
export async function createIremboInvoice(
  params: CreateInvoiceParams
): Promise<CreateInvoiceResult> {
  const config = getIremboConfig();
  const iPay = getIpayClient();

  const { transactionId, amount, currency, description, customer } = params;

  if (!amount || isNaN(amount) || amount <= 0) {
    throw new Error(`Invalid invoice amount: ${amount}`);
  }

  const paymentAccountIdentifier =
    currency === "RWF" ? config.rwfAccountIdentifier : config.usdAccountIdentifier;
  if (!paymentAccountIdentifier) {
    throw new Error(`IremboPay ${currency} account identifier is not configured in .env.`);
  }

  const productCode =
    currency === "RWF" ? config.rwfProductIdentifier : config.usdProductIdentifier;
  if (!productCode) {
    throw new Error(`IremboPay ${currency} product identifier is not configured in .env.`);
  }

  const payload = {
    transactionId,
    paymentAccountIdentifier,
    customer: {
      ...(customer?.email?.trim() ? { email: customer.email.trim() } : {}),
      ...(() => {
        const phone = normalizeRwPhoneNumber(customer?.phoneNumber);
        if (customer?.phoneNumber && !phone) {
          console.warn(
            "[IremboPay] Omitting malformed customer phoneNumber; expected 07XXXXXXXX format."
          );
        }
        return phone ? { phoneNumber: phone } : {};
      })(),
      ...(customer?.name?.trim() ? { name: customer.name.trim() } : {}),
    },
    paymentItems: [
      {
        code: productCode,
        quantity: 1,
        unitAmount: amount,
      },
    ],
    description: description || `Donation to Reclaim Hope Rwanda (${currency})`,
    language: "EN" as const,
  };

  try {
    const rawResponse = await iPay.invoice.createInvoice(payload);

    // Normalize response structure (SDK returns response.data from axios)
    const respObj = rawResponse as { data?: SdkInvoiceData; invoiceNumber?: string; paymentLinkUrl?: string; message?: string };
    const data = respObj?.data || (respObj as SdkInvoiceData);
    const invoiceNumber = data?.invoiceNumber;
    const paymentLinkUrl = data?.paymentLinkUrl;

    if (!invoiceNumber) {
      console.error("IremboPay createInvoice response missing invoiceNumber:", rawResponse);
      throw new Error(
        data?.message || "IremboPay did not return an invoice number."
      );
    }

    return {
      invoiceNumber,
      paymentLinkUrl,
      transactionId,
      amount,
      currency,
    };
  } catch (error: unknown) {
    console.error("Error creating IremboPay invoice:", error);
    const errObj = error as { response?: { data?: { message?: string } }; message?: string };
    const detail =
      errObj?.response?.data?.message ||
      errObj?.message ||
      (typeof error === "string" ? error : JSON.stringify(error));
    throw new Error(`Failed to create IremboPay invoice: ${detail}`);
  }
}

/**
 * Signature verification result.
 */
export interface SignatureVerificationResult {
  isValid: boolean;
  reason?: string;
  timestamp?: number;
  signatureReceived?: string;
  expectedSignature?: string;
}

/**
 * Verifies the incoming IremboPay webhook notification signature according to official docs:
 *
 * Header: irembopay-signature: t=<timestamp>, s=<signature>
 * Signed string: `${timestamp}#${rawBody}`
 * HMAC: SHA-256 with merchant secret key
 * Comparison: timingSafeEqual
 * Replay protection: 5 minutes tolerance (300,000 ms)
 */
export function verifyIremboWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined
): SignatureVerificationResult {
  if (!signatureHeader) {
    return { isValid: false, reason: "Missing irembopay-signature header" };
  }

  const config = getIremboConfig();

  // Step 1: Extract timestamp and signature hash from header
  // Example header: "t=1653405045000,s=bfecb20753326e5e8602f4a6e727bcd22b7cb1d00797fe5bd65db8cfaf2f4903"
  const elements = signatureHeader.split(",");
  let timestamp: string | null = null;
  let signatureHash: string | null = null;

  for (const element of elements) {
    const [prefix, ...valueParts] = element.trim().split("=");
    const value = valueParts.join("=");
    if (prefix === "t") {
      timestamp = value;
    } else if (prefix === "s") {
      signatureHash = value;
    }
  }

  if (!timestamp || !signatureHash) {
    return {
      isValid: false,
      reason: "Malformed irembopay-signature header (expected t=<timestamp>,s=<signature>)",
    };
  }

  // Step 2: Validate timestamp / replay window (5 minutes tolerance in ms)
  const timestampInt = parseInt(timestamp, 10);
  if (isNaN(timestampInt)) {
    return { isValid: false, reason: "Invalid timestamp in signature header" };
  }

  const currentTime = Date.now();
  const toleranceMs = 5 * 60 * 1000; // 5 minutes
  if (Math.abs(currentTime - timestampInt) > toleranceMs) {
    return {
      isValid: false,
      reason: `Signature timestamp expired or skewed (tolerance: 5 mins, diff: ${Math.round(
        Math.abs(currentTime - timestampInt) / 1000
      )}s)`,
      timestamp: timestampInt,
    };
  }

  // Step 3: Prepare the signed_payload string: `${timestamp}#${rawPayload}`
  const signedPayload = `${timestamp}#${rawBody}`;

  // Step 4: Determine the expected HMAC SHA256 signature
  const expectedSignature = crypto
    .createHmac("sha256", config.secretKey)
    .update(signedPayload)
    .digest("hex");

  // Step 5: Timing-safe comparison
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const receivedBuffer = Buffer.from(signatureHash, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return {
      isValid: false,
      reason: "Signature length mismatch",
      timestamp: timestampInt,
      signatureReceived: signatureHash,
      expectedSignature,
    };
  }

  const isMatch = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

  if (!isMatch) {
    return {
      isValid: false,
      reason: "Signature digest mismatch",
      timestamp: timestampInt,
      signatureReceived: signatureHash,
      expectedSignature,
    };
  }

  return {
    isValid: true,
    timestamp: timestampInt,
  };
}

export interface IremboInvoiceDetails {
  invoiceNumber: string;
  transactionId: string;
  paymentStatus: "NEW" | "PAID" | string;
  amount: number;
  currency: string;
  paidAt?: string | null;
  paymentMethod?: string | null;
  paymentReference?: string | null;
}

/**
 * Queries the official IremboPay API for the authoritative status of an invoice.
 * Endpoint: GET /payments/invoices/{invoice_reference}
 */
export async function fetchIremboInvoiceDetails(
  invoiceReference: string
): Promise<IremboInvoiceDetails> {
  const config = getIremboConfig();

  // Try via SDK first
  try {
    const iPay = getIpayClient();
    const response = (await iPay.invoice.getInvoice(invoiceReference)) as {
      data?: SdkInvoiceData;
    } & SdkInvoiceData;
    const data = response?.data || response;

    if (data?.invoiceNumber) {
      return {
        invoiceNumber: data.invoiceNumber,
        transactionId: data.transactionId || invoiceReference,
        paymentStatus: data.paymentStatus || "UNKNOWN",
        amount: Number(data.amount || 0),
        currency: data.currency || "RWF",
        paidAt: data.paidAt,
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference,
      };
    }
  } catch (sdkError) {
    console.warn(
      `SDK getInvoice failed for ${invoiceReference}, trying direct REST call:`,
      sdkError
    );
  }

  // Fallback to direct HTTP fetch with required headers
  const url = `${config.apiBaseUrl}/invoices/${encodeURIComponent(invoiceReference)}`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "irembopay-secretKey": config.secretKey,
      "X-API-Version": "3",
      Accept: "application/json",
    },
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(
      `IremboPay invoice verification request failed with HTTP ${resp.status}: ${errorText}`
    );
  }

  const json = (await resp.json()) as { data?: SdkInvoiceData } & SdkInvoiceData;
  const data = json?.data || json;

  return {
    invoiceNumber: data.invoiceNumber || invoiceReference,
    transactionId: data.transactionId || invoiceReference,
    paymentStatus: data.paymentStatus || "UNKNOWN",
    amount: Number(data.amount || 0),
    currency: data.currency || "RWF",
    paidAt: data.paidAt,
    paymentMethod: data.paymentMethod,
    paymentReference: data.paymentReference,
  };
}
