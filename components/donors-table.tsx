"use client";

import { useState } from "react";
import { Search, Users, Heart, HandCoins } from "lucide-react";
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

type Donor = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  country: string | null;
  createdAt: string;
  donations: number;
  completedDonations: number;
  donatedAmount: number;
  donatedCurrencies: string[];
  sponsorships: number;
  activeSponsorships: number;
  sponsorshipAmount: number;
  sponsorshipCurrency: string;
};

function formatAmount(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return amount.toLocaleString("en-US");
  }
}

const SPONSORSHIP_OPTIONS = [
  { value: "all", label: "All donors" },
  { value: "active", label: "With active sponsorship" },
  { value: "none", label: "No active sponsorship" },
];

function formatDonatedAmount(donor: Donor) {
  if (donor.donatedCurrencies.length === 1) {
    return formatAmount(donor.donatedAmount, donor.donatedCurrencies[0]);
  }
  return donor.donatedAmount.toLocaleString("en-US");
}

export function DonorsTable({ donors }: { donors: Donor[] }) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("ALL");
  const [sponsorship, setSponsorship] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const countrySet = new Set(donors.map((d) => d.country).filter(Boolean) as string[]);
  const countries = [
    { value: "ALL", label: "All countries" },
    ...[...countrySet].sort().map((c) => ({ value: c, label: c })),
  ];

  const totalDonated = donors.reduce((total, donor) => total + donor.donatedAmount, 0);
  const activeSponsors = donors.reduce((total, donor) => total + donor.activeSponsorships, 0);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const sortDirMul = sortDir === "asc" ? 1 : -1;
  const searchQuery = search.trim().toLowerCase();
  const filtered = [...donors]
    .filter((donor) => {
      if (country !== "ALL" && donor.country !== country) return false;
      if (sponsorship === "active" && donor.activeSponsorships === 0) return false;
      if (sponsorship === "none" && donor.activeSponsorships > 0) return false;
      if (!searchQuery) return true;
      return [donor.name, donor.email, donor.country ?? ""].some((value) =>
        value.toLowerCase().includes(searchQuery)
      );
    })
    .sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name) * sortDirMul;
        case "donatedAmount":
          return (a.donatedAmount - b.donatedAmount) * sortDirMul;
        case "donations":
          return (a.completedDonations - b.completedDonations) * sortDirMul;
        case "activeSponsorships":
          return (a.activeSponsorships - b.activeSponsorships) * sortDirMul;
        case "createdAt":
        default:
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * sortDirMul;
      }
    });

  const clearAll = () => {
    setSearch("");
    setCountry("ALL");
    setSponsorship("all");
    setSortKey("createdAt");
    setSortDir("desc");
  };

  const hasFilters = search.trim() !== "" || country !== "ALL" || sponsorship !== "all";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">People who support Reclaim Hope</p>
          <h1 className="text-3xl font-semibold tracking-tight">Donors</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, country…"
              aria-label="Search donors"
              className="bg-white pl-9"
            />
          </div>
          <ExportButton
            dataset="donors"
            query={{ search: search.trim(), country, sponsorship, sort: sortKey, dir: sortDir }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total donors</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{donors.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed donations</CardTitle>
            <HandCoins className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatAmount(totalDonated)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active sponsorships</CardTitle>
            <Heart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{activeSponsors}</CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <TableFilter label="Country" value={country} options={countries} onChange={setCountry} />
        <TableFilter label="Sponsorship" value={sponsorship} options={SPONSORSHIP_OPTIONS} onChange={setSponsorship} />
        {hasFilters && <ClearFiltersButton onClick={clearAll} />}
        <div className="ml-auto">
          <ResultCount shown={filtered.length} total={donors.length} itemName="donors" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><SortableTh label="Donor" sortKey="name" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
              <TableHead>Contact</TableHead>
              <TableHead><SortableTh label="Donations" sortKey="donatedAmount" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
              <TableHead><SortableTh label="Sponsorships" sortKey="activeSponsorships" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
              <TableHead><SortableTh label="Joined" sortKey="createdAt" activeKey={sortKey} dir={sortDir} onSort={handleSort} /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {donors.length === 0 ? "No donors yet." : "No donors match your search or filters."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell>
                    <div className="font-medium">{donor.name}</div>
                    <div className="text-xs text-muted-foreground">{donor.country || "Country not provided"}</div>
                  </TableCell>
                  <TableCell>
                    <div>{donor.email}</div>
                    <div className="text-xs text-muted-foreground">{donor.phoneNumber || "Phone not provided"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatDonatedAmount(donor)}</div>
                    <div className="text-xs text-muted-foreground">
                      {donor.completedDonations} completed of {donor.donations}
                      {donor.donatedCurrencies.length > 1 && " (multiple currencies)"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {donor.activeSponsorships > 0 ? (
                      <Badge variant="secondary">{donor.activeSponsorships} active</Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                    {donor.sponsorshipAmount > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatAmount(donor.sponsorshipAmount, donor.sponsorshipCurrency)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(donor.createdAt).toLocaleDateString()}
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
