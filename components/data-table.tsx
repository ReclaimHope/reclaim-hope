"use client";

import { useMemo, useState } from "react";
import {
  MoreVertical,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateChildDialog } from "./create-child";
import useSWR from "swr";
import DeleteChildDialog from "./delete-child-dialog";
import { UpdateChildDialog } from "./update-child";
import {
  ClearFiltersButton,
  ExportButton,
  ResultCount,
  SortableTh,
  TableFilter,
  type SortDir,
} from "@/components/admin-table-controls";

type ChildRow = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dream: string;
  imageUrl?: string | null;
  story?: string;
  isSponsored?: boolean;
  sponsorshipStatus?: string;
  sponsorName?: string | null;
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "All children" },
  { value: "Sponsored", label: "Sponsored" },
  { value: "Available", label: "Available" },
];

function isSponsored(child: ChildRow) {
  return child.isSponsored || child.sponsorshipStatus === "Sponsored";
}

export default function DataTable() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const getAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };
  const { data, error, isLoading: isFetching } = useSWR('/api/children', fetcher);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const list: ChildRow[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = list.filter((child) => {
      const sponsored = isSponsored(child);
      if (status === "Sponsored" && !sponsored) return false;
      if (status === "Available" && sponsored) return false;
      if (!q) return true;
      return [
        `${child.firstName} ${child.lastName}`,
        child.dream ?? "",
        child.sponsorName ?? "",
      ].some((v) => v.toLowerCase().includes(q));
    });
    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      switch (sortKey) {
        case "age":
          return (getAge(a.dateOfBirth) - getAge(b.dateOfBirth)) * dir;
        case "dream":
          return (a.dream ?? "").localeCompare(b.dream ?? "") * dir;
        case "status":
          return (Number(isSponsored(a)) - Number(isSponsored(b))) * dir;
        case "name":
        default:
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`) * dir;
      }
    });
  }, [list, search, status, sortKey, sortDir]);

  const clearAll = () => {
    setSearch("");
    setStatus("ALL");
    setSortKey("name");
    setSortDir("asc");
  };

  const hasFilters = search.trim() !== "" || status !== "ALL";

  return (
    <div className="space-y-4 mx-auto px-4 max-w-7xl sm:px-6 lg:px-8">
      {/* Top Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Children</h2>
          <p className="text-sm text-gray-500">Track registered children and sponsorship availability</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, dream, sponsor…"
              aria-label="Search children"
              className="bg-white pl-9"
            />
          </div>
          <ExportButton
            dataset="children"
            query={{ search: search.trim(), status, sort: sortKey, dir: sortDir }}
          />
          <CreateChildDialog />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <TableFilter label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
        {hasFilters && <ClearFiltersButton onClick={clearAll} />}
        <div className="ml-auto">
          <ResultCount shown={visible.length} total={list.length} itemName="children" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/75">
              <TableHead className="font-semibold text-gray-700">
                <SortableTh label="Full Name" sortKey="name" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                <SortableTh label="Age" sortKey="age" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                <SortableTh label="Dream" sortKey="dream" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                <SortableTh label="Status" sortKey="status" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Active Sponsor</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Loading children data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-red-500">
                  Error loading children.
                </TableCell>
              </TableRow>
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {list.length === 0
                    ? 'No children registered yet. Click "Create Child" to add one.'
                    : "No children match your search or filters."}
                </TableCell>
              </TableRow>
            ) : (
              visible.map((child: ChildRow) => (
                <TableRow key={child.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">
                    {child.firstName} {child.lastName}
                  </TableCell>
                  <TableCell className="text-gray-600">{getAge(child.dateOfBirth)} yrs</TableCell>
                  <TableCell className="text-gray-600">{child.dream}</TableCell>
                  <TableCell>
                    {isSponsored(child) ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-medium">
                        Sponsored
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 font-medium">
                        Available
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">
                    {child.sponsorName || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <UpdateChildDialog child={{ id: child.id, firstName: child.firstName, lastName: child.lastName, dateOfBirth: child.dateOfBirth, dream: child.dream, imageUrl: child.imageUrl ?? "", story: child.story ?? "" }} />
                        <DeleteChildDialog id={child.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
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
