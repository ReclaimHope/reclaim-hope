"use client";

import { useMemo, useState } from "react";
import { Clock3, CreditCard, Search, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ClearFiltersButton,
  ExportButton,
  PeriodFilter,
  ResultCount,
  SortableTh,
  TableFilter,
  inSelectedPeriod,
  periodQuery,
  type PeriodValue,
  type SortDir,
} from "@/components/admin-table-controls";

type Payment = {
  id: string;
  reference: string;
  transactionId: string | null;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  donor: { name: string; email: string } | null;
  source: string;
};

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString("en-US")} ${currency}`;
  }
}

function label(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "SUCCESSFUL", label: "Successful" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

const CURRENCY_OPTIONS = [
  { value: "ALL", label: "All currencies" },
  { value: "RWF", label: "RWF" },
  { value: "USD", label: "USD" },
];

const SOURCE_OPTIONS = [
  { value: "all", label: "All sources" },
  { value: "donation", label: "Donations" },
  { value: "sponsorship", label: "Sponsorships" },
];

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [currency, setCurrency] = useState("ALL");
  const [source, setSource] = useState("all");
  const [period, setPeriod] = useState<PeriodValue>("all");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const successful = payments.filter((payment) => payment.status === "SUCCESSFUL");
  const pending = payments.filter((payment) => payment.status === "PENDING");

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "donor" || key === "reference" ? "asc" : "desc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = payments.filter((payment) => {
      if (status !== "ALL" && payment.status !== status) return false;
      if (currency !== "ALL" && payment.currency !== currency) return false;
      if (!inSelectedPeriod(payment.createdAt, period, year, month)) return false;
      if (source !== "all") {
        const kind = payment.source.toLowerCase().startsWith("donation")
          ? "donation"
          : payment.source.toLowerCase().startsWith("sponsorship")
            ? "sponsorship"
            : "unlinked";
        if (kind !== source) return false;
      }
      if (!q) return true;
      return [
        payment.reference,
        payment.transactionId ?? "",
        payment.donor?.name ?? "Anonymous donor",
        payment.donor?.email ?? "",
        payment.source,
        payment.status,
      ].some((value) => value.toLowerCase().includes(q));
    });

    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      switch (sortKey) {
        case "reference":
          return a.reference.localeCompare(b.reference) * dir;
        case "donor":
          return (a.donor?.name ?? "").localeCompare(b.donor?.name ?? "") * dir;
        case "source":
          return a.source.localeCompare(b.source) * dir;
        case "amount":
          return (a.amount - b.amount) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        case "paidAt":
          return ((a.paidAt ? new Date(a.paidAt).getTime() : 0) - (b.paidAt ? new Date(b.paidAt).getTime() : 0)) * dir;
        case "createdAt":
        default:
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      }
    });
  }, [payments, search, status, currency, source, period, year, month, sortKey, sortDir]);

  const clearAll = () => {
    setSearch("");
    setStatus("ALL");
    setCurrency("ALL");
    setSource("all");
    setPeriod("all");
    setSortKey("createdAt");
    setSortDir("desc");
  };

  const hasFilters = search.trim() !== "" || status !== "ALL" || currency !== "ALL" || source !== "all" || period !== "all";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Track gateway records for donations and sponsorships</p>
          <h1 className="text-3xl font-semibold tracking-tight">Payments</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ref, donor, source…" aria-label="Search payments" className="bg-white pl-9" />
          </div>
          <ExportButton
            dataset="payments"
            query={{ search: search.trim(), status, currency, source, sort: sortKey, dir: sortDir, ...periodQuery(period, year, month) }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total payments</CardTitle><WalletCards className="size-4 text-muted-foreground" /></CardHeader>
          <CardContent className="text-2xl font-semibold">{payments.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Successful</CardTitle><CreditCard className="size-4 text-emerald-600" /></CardHeader>
          <CardContent className="text-2xl font-semibold">{successful.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Awaiting verification</CardTitle><Clock3 className="size-4 text-amber-600" /></CardHeader>
          <CardContent className="text-2xl font-semibold">{pending.length}</CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <TableFilter label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
        <TableFilter label="Currency" value={currency} options={CURRENCY_OPTIONS} onChange={setCurrency} />
        <TableFilter label="Source" value={source} options={SOURCE_OPTIONS} onChange={setSource} />
        <PeriodFilter
          period={period}
          year={year}
          month={month}
          onPeriodChange={setPeriod}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
        {hasFilters && <ClearFiltersButton onClick={clearAll} />}
        <div className="ml-auto">
          <ResultCount shown={filtered.length} total={payments.length} itemName="payments" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead><SortableTh label="Reference" sortKey="reference" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
            <TableHead><SortableTh label="Donor" sortKey="donor" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
            <TableHead><SortableTh label="Source" sortKey="source" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
            <TableHead><SortableTh label="Amount" sortKey="amount" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
            <TableHead><SortableTh label="Status" sortKey="status" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
            <TableHead><SortableTh label="Paid" sortKey="paidAt" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 ? <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">{payments.length === 0 ? "No payments yet." : "No payments match your search or filters."}</TableCell></TableRow> : filtered.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell><div className="font-mono text-xs font-medium">{payment.reference}</div><div className="text-xs text-muted-foreground">{payment.provider}</div></TableCell>
                <TableCell><div className="font-medium">{payment.donor?.name || "Anonymous donor"}</div><div className="text-xs text-muted-foreground">{payment.donor?.email || "No email provided"}</div></TableCell>
                <TableCell className="whitespace-nowrap">{label(payment.source)}</TableCell>
                <TableCell className="whitespace-nowrap font-medium">{formatAmount(payment.amount, payment.currency)}</TableCell>
                <TableCell><Badge variant={payment.status === "SUCCESSFUL" ? "default" : payment.status === "PENDING" ? "outline" : "secondary"} className={payment.status === "SUCCESSFUL" ? "bg-emerald-600 hover:bg-emerald-600" : payment.status === "PENDING" ? "border-amber-300 bg-amber-50 text-amber-800" : ""}>{label(payment.status)}</Badge></TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "Not paid"}</TableCell>
                <TableCell className="text-right">{payment.status === "SUCCESSFUL" ? <span className="text-xs font-medium text-emerald-700">Successful</span> : <span className="text-xs text-muted-foreground">Awaiting IremboPay</span>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
