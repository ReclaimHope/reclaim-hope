"use client";

import { useMemo, useState } from "react";
import { Clock3, HandCoins, Heart, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClearFiltersButton,
  ExportButton,
  ResultCount,
  SortableTh,
  TableFilter,
  type SortDir,
} from "@/components/admin-table-controls";


type Donation = {
  id: string;
  amount: number;
  currency: string;
  category?: string | null;
  status: string;
  createdAt: string;
  donor: { name: string; email: string; country: string | null } | null;
  latestPayment: {
    id: string;
    reference: string;
    status: string;
    paidAt: string | null;
  } | null;
};

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("en-US")} ${currency}`;
  }
}

function statusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const CURRENCY_OPTIONS = [
  { value: "ALL", label: "All currencies" },
  { value: "RWF", label: "RWF" },
  { value: "USD", label: "USD" },
];

const CATEGORY_OPTIONS = [
  { value: "ALL", label: "All purposes" },
  { value: "MEALS", label: "Meals" },
  { value: "HEALTH", label: "Health" },
  { value: "EDUCATION", label: "Education" },
  { value: "LOVE_GIFT", label: "Love gift" },
];

export function DonationsTable({ donations }: { donations: Donation[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [currency, setCurrency] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const completed = donations.filter((donation) => donation.status === "COMPLETED");
  const pending = donations.filter((donation) => donation.status === "PENDING");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "donor" ? "asc" : "desc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = donations.filter((donation) => {
      if (status !== "ALL" && donation.status !== status) return false;
      if (currency !== "ALL" && donation.currency !== currency) return false;
      if (category !== "ALL" && (donation.category ?? "") !== category) return false;
      if (!q) return true;
      return [
        donation.donor?.name ?? "Anonymous donor",
        donation.donor?.email ?? "",
        donation.status,
        donation.currency,
        (donation.category ?? "").replace("_", " "),
        donation.latestPayment?.reference ?? "",
      ].some((value) => value.toLowerCase().includes(q));
    });

    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      switch (sortKey) {
        case "donor":
          return (a.donor?.name ?? "").localeCompare(b.donor?.name ?? "") * dir;
        case "amount":
          return (a.amount - b.amount) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        case "category":
          return (a.category ?? "").localeCompare(b.category ?? "") * dir;
        case "createdAt":
        default:
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      }
    });
  }, [donations, search, status, currency, category, sortKey, sortDir]);

  const clearAll = () => {
    setSearch("");
    setStatus("ALL");
    setCurrency("ALL");
    setCategory("ALL");
    setSortKey("createdAt");
    setSortDir("desc");
  };

  const hasFilters = search.trim() !== "" || status !== "ALL" || currency !== "ALL" || category !== "ALL";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Review one-time contributions and payment records</p>
          <h1 className="text-3xl font-semibold tracking-tight">Donations</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search donor, email, reference…"
              aria-label="Search donations"
              className="bg-white pl-9"
            />
          </div>
          <ExportButton
            dataset="donations"
            query={{ search: search.trim(), status, currency, category, sort: sortKey, dir: sortDir }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total donations</CardTitle>
            <HandCoins className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{donations.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Heart className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{completed.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Awaiting payment</CardTitle>
            <Clock3 className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{pending.length}</CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <TableFilter label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
        <TableFilter label="Currency" value={currency} options={CURRENCY_OPTIONS} onChange={setCurrency} />
        <TableFilter label="Purpose" value={category} options={CATEGORY_OPTIONS} onChange={setCategory} />
        {hasFilters && <ClearFiltersButton onClick={clearAll} />}
        <div className="ml-auto">
          <ResultCount shown={filtered.length} total={donations.length} itemName="donations" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><SortableTh label="Donor" sortKey="donor" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
              <TableHead><SortableTh label="Amount" sortKey="amount" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
              <TableHead><SortableTh label="Purpose" sortKey="category" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
              <TableHead><SortableTh label="Status" sortKey="status" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
              <TableHead>Last payment</TableHead>
              <TableHead><SortableTh label="Date" sortKey="createdAt" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {donations.length === 0 ? "No donations yet." : "No donations match your search or filters."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    <div className="font-medium">{donation.donor?.name || "Anonymous donor"}</div>
                    <div className="text-xs text-muted-foreground">{donation.donor?.email || "No email provided"}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{formatAmount(donation.amount, donation.currency)}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {(donation.category ?? "").replace("_", " ") || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={donation.status === "COMPLETED" ? "default" : donation.status === "PENDING" ? "outline" : "secondary"}
                      className={donation.status === "COMPLETED" ? "bg-emerald-600 hover:bg-emerald-600" : donation.status === "PENDING" ? "border-amber-300 bg-amber-50 text-amber-800" : ""}
                    >
                      {statusLabel(donation.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {donation.latestPayment ? (
                      <div>
                        <div className="font-mono text-xs">{donation.latestPayment.reference}</div>
                        <div className="text-xs text-muted-foreground">{statusLabel(donation.latestPayment.status)}</div>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">No payment</span>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {donation.status === "COMPLETED" ? (
                      <span className="text-xs font-medium text-emerald-700">Complete</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Awaiting IremboPay</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
