"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Clock3, HandCoins, Heart, Search } from "lucide-react";
import { verifyPaymentAction } from "@/app/actions/sponsorship";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

type Donation = {
  id: string;
  amount: number;
  currency: string;
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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function statusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function DonationsTable({ donations }: { donations: Donation[] }) {
  const [search, setSearch] = useState("");
  const [isVerifying, startVerification] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const completed = donations.filter((donation) => donation.status === "COMPLETED");
  const pending = donations.filter((donation) => donation.status === "PENDING");
  const filteredDonations = donations.filter((donation) =>
    [
      donation.donor?.name ?? "Anonymous donor",
      donation.donor?.email ?? "",
      donation.status,
      donation.latestPayment?.reference ?? "",
    ].some((value) => value.toLowerCase().includes(search.toLowerCase()))
  );

  function handleVerify(paymentId: string) {
    setProcessingId(paymentId);
    startVerification(async () => {
      const result = await verifyPaymentAction(paymentId);
      if (result.success) {
        toast.success("Donation marked as completed.");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to verify donation.");
        setProcessingId(null);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Review one-time contributions and payment records</p>
          <h1 className="text-3xl font-semibold tracking-tight">Donations</h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search donations"
            aria-label="Search donations"
            className="pl-9"
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

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last paymentd</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {donations.length === 0 ? "No donations yet." : "No donations match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    <div className="font-medium">{donation.donor?.name || "Anonymous donor"}</div>
                    <div className="text-xs text-muted-foreground">{donation.donor?.email || "No email provided"}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{formatAmount(donation.amount, donation.currency)}</TableCell>
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
                    {donation.status === "PENDING" && donation.latestPayment ? (
                      <Button
                        size="sm"
                        disabled={isVerifying && processingId === donation.latestPayment.id}
                        onClick={() => handleVerify(donation.latestPayment!.id)}
                      >
                        <CheckCircle2 className="size-4" />
                        {isVerifying && processingId === donation.latestPayment.id ? "Verifying" : "Verify"}
                      </Button>
                    ) : donation.status === "COMPLETED" ? (
                      <span className="text-xs font-medium text-emerald-700">Complete</span>
                    ) : null}
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