"use client";

import { useState } from "react";
import { Clock3, CreditCard, Search, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function label(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  const [search, setSearch] = useState("");
  const successful = payments.filter((payment) => payment.status === "SUCCESSFUL");
  const pending = payments.filter((payment) => payment.status === "PENDING");
  const filteredPayments = payments.filter((payment) => [
    payment.reference,
    payment.transactionId ?? "",
    payment.donor?.name ?? "Anonymous donor",
    payment.donor?.email ?? "",
    payment.source,
    payment.status,
  ].some((value) => value.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Track gateway records for donations and sponsorships</p>
          <h1 className="text-3xl font-semibold tracking-tight">Payments</h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search payments" aria-label="Search payments" className="pl-9" />
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

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Reference</TableHead><TableHead>Donor</TableHead><TableHead>Source</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Paid</TableHead><TableHead className="text-right">Action</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">{payments.length === 0 ? "No payments yet." : "No payments match your search."}</TableCell></TableRow> : filteredPayments.map((payment) => (
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