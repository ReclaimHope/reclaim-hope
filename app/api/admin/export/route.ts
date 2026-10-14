import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth";
import {
  buildExportWorkbook,
  sheetSpecsForDataset,
  type ExportDataset,
  type SheetSpec,
} from "@/lib/admin-exports";

export const dynamic = "force-dynamic";

const VALID_DATASETS: ExportDataset[] = [
  "children",
  "donors",
  "donations",
  "payments",
  "sponsorships",
  "all",
];

function q(params: URLSearchParams, key: string): string {
  return (params.get(key) ?? "").trim();
}

function matchesSearch(haystack: (string | null | undefined)[], needle: string): boolean {
  if (!needle) return true;
  const n = needle.toLowerCase();
  return haystack.some((h) => (h ?? "").toLowerCase().includes(n));
}

function sortRows(
  rows: Record<string, string | number | null | undefined>[],
  sort: string,
  dir: string,
  numericKeys: Set<string>
): void {
  if (!sort) return;
  const mul = dir === "desc" ? -1 : 1;
  rows.sort((a, b) => {
    const av = a[sort];
    const bv = b[sort];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (numericKeys.has(sort)) return (Number(av) - Number(bv)) * mul;
    return String(av).localeCompare(String(bv)) * mul;
  });
}

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type Row = Record<string, string | number | null | undefined>;

/** Drop internal sort-helper keys (e.g. `_created`) before handing rows to Excel. */
function stripInternal<T extends Row>(rows: (T & Record<string, unknown>)[], ...keys: string[]): Row[] {
  return rows.map((r) => {
    const copy: Record<string, unknown> = { ...r };
    for (const k of keys) delete copy[k];
    return copy as Row;
  });
}

export interface PeriodRange {
  from: Date;
  to: Date;
  label: string;
}

/**
 * Monthly / yearly report window from `?period=monthly&year=2025&month=3`
 * or `?period=yearly&year=2025`. Returns null for all-time (or invalid input).
 * Records are matched on their creation date.
 */
function getPeriodRange(params: URLSearchParams): PeriodRange | null {
  const period = q(params, "period").toLowerCase();
  const year = Number(q(params, "year"));
  if (period !== "monthly" && period !== "yearly") return null;
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return null;
  if (period === "yearly") {
    return {
      from: new Date(year, 0, 1),
      to: new Date(year + 1, 0, 1),
      label: `${year}`,
    };
  }
  const month = Number(q(params, "month"));
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  const monthName = new Date(year, month - 1, 1).toLocaleString("en-US", { month: "long" });
  return {
    from: new Date(year, month - 1, 1),
    to: new Date(year, month, 1),
    label: `${monthName} ${year}`,
  };
}

function inPeriod(createdAt: Date, range: PeriodRange | null): boolean {
  if (!range) return true;
  const t = new Date(createdAt).getTime();
  return t >= range.from.getTime() && t < range.to.getTime();
}

async function getChildrenRows(params: URLSearchParams) {
  const children = await prisma.child.findMany({
    include: {
      sponsorships: {
        where: { status: "ACTIVE" },
        include: { donor: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  const search = q(params, "search").toLowerCase();
  const status = q(params, "status").toUpperCase();
  const sort = q(params, "sort");
  const dir = q(params, "dir") === "desc" ? "desc" : "asc";
  const period = getPeriodRange(params);

  let rows = children.filter((c) => inPeriod(c.createdAt, period)).map((c) => {
    const active = c.sponsorships[0] ?? null;
    const dob = new Date(c.dateOfBirth);
    const age = Math.max(
      0,
      new Date().getFullYear() -
        dob.getFullYear() -
        (new Date().getMonth() < dob.getMonth() ||
        (new Date().getMonth() === dob.getMonth() && new Date().getDate() < dob.getDate())
          ? 1
          : 0)
    );
    return {
      name: `${c.firstName} ${c.lastName}`.trim(),
      dateOfBirth: fmtDate(c.dateOfBirth),
      age,
      dream: c.dream,
      status: active ? "Sponsored" : "Available",
      sponsor: active
        ? `${active.donor.firstName} ${active.donor.lastName}`.trim()
        : "",
      createdAt: fmtDate(c.createdAt),
      _created: c.createdAt.getTime(),
    };
  });

  rows = rows.filter(
    (r) =>
      (status === "" || status === "ALL" || r.status.toUpperCase() === status) &&
      matchesSearch([r.name, r.dream, r.sponsor], search)
  );
  if (sort === "age") rows.sort((a, b) => (dir === "desc" ? b.age - a.age : a.age - b.age));
  else if (sort === "createdAt") rows.sort((a, b) => (dir === "desc" ? b._created - a._created : a._created - b._created));
  else if (sort) sortRows(rows, sort, dir, new Set(["age"]));
  return stripInternal(rows, "_created");
}

async function getDonorRows(params: URLSearchParams) {
  const donors = await prisma.donor.findMany({
    include: { donations: true, sponsorships: true },
    orderBy: { createdAt: "desc" },
  });
  const search = q(params, "search").toLowerCase();
  const country = q(params, "country");
  const sponsorship = q(params, "sponsorship").toLowerCase();
  const sort = q(params, "sort");
  const dir = q(params, "dir") === "desc" ? "desc" : "asc";
  const period = getPeriodRange(params);

  let rows = donors.filter((d) => inPeriod(d.createdAt, period)).map((d) => {
    const completed = d.donations.filter((x) => x.status === "COMPLETED");
    const active = d.sponsorships.filter((x) => x.status === "ACTIVE").length;
    return {
      name: `${d.firstName} ${d.lastName}`.trim(),
      email: d.email,
      phone: d.phoneNumber ?? "",
      country: d.country ?? "",
      donations: `${completed.length}/${d.donations.length}`,
      donatedAmount: completed.reduce((t, x) => t + Number(x.amount), 0),
      activeSponsorships: active,
      totalSponsorships: d.sponsorships.length,
      createdAt: fmtDate(d.createdAt),
      _created: d.createdAt.getTime(),
      _completed: completed.length,
    };
  });

  rows = rows.filter(
    (r) =>
      (country === "" || country === "ALL" || r.country === country) &&
      (sponsorship === "" ||
        sponsorship === "all" ||
        (sponsorship === "active" && r.activeSponsorships > 0) ||
        (sponsorship === "none" && r.activeSponsorships === 0)) &&
      matchesSearch([r.name, r.email, r.country], search)
  );
  if (sort === "createdAt" || sort === "joined")
    rows.sort((a, b) => (dir === "desc" ? b._created - a._created : a._created - b._created));
  else if (sort === "donations")
    rows.sort((a, b) => (dir === "desc" ? b._completed - a._completed : a._completed - b._completed));
  else if (sort) sortRows(rows, sort, dir, new Set(["donatedAmount", "activeSponsorships"]));
  return stripInternal(rows, "_created", "_completed", "totalSponsorships");
}

async function getDonationRows(params: URLSearchParams) {
  const donations = await prisma.donation.findMany({
    include: { donor: true, payments: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
  const search = q(params, "search").toLowerCase();
  const status = q(params, "status").toUpperCase();
  const currency = q(params, "currency").toUpperCase();
  const category = q(params, "category").toUpperCase();
  const sort = q(params, "sort");
  const dir = q(params, "dir") === "desc" ? "desc" : "asc";
  const period = getPeriodRange(params);

  let rows = donations.filter((d) => inPeriod(d.createdAt, period)).map((d) => ({
    donor: d.donor ? `${d.donor.firstName} ${d.donor.lastName}`.trim() : "Anonymous donor",
    email: d.donor?.email ?? "",
    category: (d.category ?? "").replace("_", " "),
    amount: Number(d.amount),
    currency: d.currency,
    status: d.status,
    paymentRef: d.payments[0]?.reference ?? "",
    createdAt: fmtDate(d.createdAt),
    _created: d.createdAt.getTime(),
  }));

  rows = rows.filter(
    (r) =>
      (status === "" || status === "ALL" || r.status === status) &&
      (currency === "" || currency === "ALL" || r.currency === currency) &&
      (category === "" || category === "ALL" || r.category.replace(" ", "_") === category) &&
      matchesSearch([r.donor, r.email, r.status, r.paymentRef], search)
  );
  if (sort === "date" || sort === "createdAt")
    rows.sort((a, b) => (dir === "desc" ? b._created - a._created : a._created - b._created));
  else if (sort) sortRows(rows, sort, dir, new Set(["amount"]));
  return stripInternal(rows, "_created");
}

async function getPaymentRows(params: URLSearchParams) {
  const payments = await prisma.payment.findMany({
    include: {
      donation: { include: { donor: true } },
      sponsorship: { include: { donor: true, child: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  const search = q(params, "search").toLowerCase();
  const status = q(params, "status").toUpperCase();
  const currency = q(params, "currency").toUpperCase();
  const source = q(params, "source").toLowerCase();
  const sort = q(params, "sort");
  const dir = q(params, "dir") === "desc" ? "desc" : "asc";
  const period = getPeriodRange(params);

  let rows = payments.filter((p) => inPeriod(p.createdAt, period)).map((p) => {
    const donor = p.donation?.donor ?? p.sponsorship?.donor;
    const src = p.donation
      ? `Donation: ${(p.donation.category ?? "General").replace("_", " ")}`
      : p.sponsorship
        ? `Sponsorship: ${p.sponsorship.child.firstName} ${p.sponsorship.child.lastName}`
        : "Unlinked payment";
    return {
      reference: p.reference,
      transactionId: p.transactionId ?? "",
      donor: donor ? `${donor.firstName} ${donor.lastName}`.trim() : "Anonymous donor",
      email: donor?.email ?? "",
      source: src,
      sourceKind: p.donation ? "donation" : p.sponsorship ? "sponsorship" : "unlinked",
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      paidAt: p.paidAt ? fmtDate(p.paidAt) : "Not paid",
      createdAt: fmtDate(p.createdAt),
      _created: p.createdAt.getTime(),
      _paid: p.paidAt ? new Date(p.paidAt).getTime() : 0,
    };
  });

  rows = rows.filter(
    (r) =>
      (status === "" || status === "ALL" || r.status === status) &&
      (currency === "" || currency === "ALL" || r.currency === currency) &&
      (source === "" || source === "all" || r.sourceKind === source) &&
      matchesSearch([r.reference, r.transactionId, r.donor, r.email, r.source, r.status], search)
  );
  if (sort === "createdAt")
    rows.sort((a, b) => (dir === "desc" ? b._created - a._created : a._created - b._created));
  else if (sort === "paidAt" || sort === "paid")
    rows.sort((a, b) => (dir === "desc" ? b._paid - a._paid : a._paid - b._paid));
  else if (sort) sortRows(rows, sort, dir, new Set(["amount"]));
  return stripInternal(rows, "_created", "_paid", "sourceKind", "email");
}

async function getSponsorshipRows(params: URLSearchParams) {
  const list = await prisma.sponsorship.findMany({
    include: { donor: true, child: true, payments: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
  const search = q(params, "search").toLowerCase();
  const status = q(params, "status").toUpperCase();
  const frequency = q(params, "frequency").toUpperCase();
  const currency = q(params, "currency").toUpperCase();
  const sort = q(params, "sort");
  const dir = q(params, "dir") === "desc" ? "desc" : "asc";
  const period = getPeriodRange(params);

  let rows = list.filter((s) => inPeriod(s.createdAt, period)).map((s) => ({
    donor: `${s.donor.firstName} ${s.donor.lastName}`.trim(),
    email: s.donor.email,
    child: `${s.child.firstName} ${s.child.lastName}`.trim(),
    amount: Number(s.amount),
    currency: s.currency,
    frequency: s.frequency,
    status: s.status,
    paymentRef: s.payments[0]?.reference ?? s.subscriptionReference ?? "",
    startedAt: s.startedAt ? fmtDate(s.startedAt) : "Not started",
    endedAt: s.endedAt ? fmtDate(s.endedAt) : s.status === "ACTIVE" ? "Ongoing" : "",
    createdAt: fmtDate(s.createdAt),
    _created: s.createdAt.getTime(),
    _started: s.startedAt ? new Date(s.startedAt).getTime() : 0,
  }));

  rows = rows.filter(
    (r) =>
      (status === "" || status === "ALL" || r.status === status) &&
      (frequency === "" || frequency === "ALL" || r.frequency === frequency) &&
      (currency === "" || currency === "ALL" || r.currency === currency) &&
      matchesSearch([r.donor, r.email, r.child, r.paymentRef, r.status], search)
  );
  if (sort === "createdAt")
    rows.sort((a, b) => (dir === "desc" ? b._created - a._created : a._created - b._created));
  else if (sort === "startedAt" || sort === "started")
    rows.sort((a, b) => (dir === "desc" ? b._started - a._started : a._started - b._started));
  else if (sort) sortRows(rows, sort, dir, new Set(["amount"]));
  return stripInternal(rows, "_created", "_started");
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized. Admin login required." }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const dataset = (params.get("dataset") ?? "").toLowerCase() as ExportDataset;
  if (!VALID_DATASETS.includes(dataset)) {
    return NextResponse.json(
      { error: "Invalid dataset. Use children, donors, donations, payments, sponsorships, or all." },
      { status: 400 }
    );
  }

  try {
    const activeFilters: string[] = [];
    for (const key of ["search", "status", "currency", "category", "frequency", "country", "source", "sponsorship", "sort", "dir"]) {
      const v = q(params, key);
      if (v) activeFilters.push(`${key}=${v}`);
    }
    const periodRange = getPeriodRange(params);
    if (periodRange) activeFilters.push(`period=${periodRange.label}`);
    const filterSummary = activeFilters.length > 0 ? activeFilters.join(", ") : "none";

    let sheets: SheetSpec[];
    if (dataset === "all") {
      const [children, donors, donations, payments, sponsorships] = await Promise.all([
        getChildrenRows(params),
        getDonorRows(params),
        getDonationRows(params),
        getPaymentRows(params),
        getSponsorshipRows(params),
      ]);
      const totalDonated = donations
        .filter((d) => d.status === "COMPLETED")
        .reduce((t, d) => t + Number(d.amount), 0);
      const summary: SheetSpec = {
        name: "Summary",
        title: "Overview",
        columns: [
          { header: "Metric", key: "metric", width: 32 },
          { header: "Value", key: "value", width: 22 },
        ],
        rows: [
          { metric: "Children", value: children.length },
          { metric: "Donors", value: donors.length },
          { metric: "Donations", value: donations.length },
          { metric: "Payments", value: payments.length },
          { metric: "Sponsorships", value: sponsorships.length },
          { metric: "Completed donated amount", value: Math.round(totalDonated * 100) / 100 },
        ],
      };
      sheets = [
        summary,
        sheetSpecsForDataset("children", children),
        sheetSpecsForDataset("donors", donors),
        sheetSpecsForDataset("donations", donations),
        sheetSpecsForDataset("payments", payments),
        sheetSpecsForDataset("sponsorships", sponsorships),
      ];
    } else {
      const loaders = {
        children: getChildrenRows,
        donors: getDonorRows,
        donations: getDonationRows,
        payments: getPaymentRows,
        sponsorships: getSponsorshipRows,
      };
      const rows = await loaders[dataset](params);
      sheets = [sheetSpecsForDataset(dataset, rows)];
    }

    const workbook = await buildExportWorkbook(sheets, filterSummary);
    const buffer = await workbook.xlsx.writeBuffer();

    const date = new Date().toISOString().slice(0, 10);
    const periodSlug = periodRange ? `-${periodRange.label.toLowerCase().replace(/\s+/g, "-")}` : "";
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="reclaim-hope-${dataset}${periodSlug}-${date}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error building admin export:", error);
    return NextResponse.json({ error: "Failed to build Excel report." }, { status: 500 });
  }
}
