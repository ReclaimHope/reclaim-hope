"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Download, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortDir = "asc" | "desc";
export type PeriodValue = "all" | "monthly" | "yearly";

export const PERIOD_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const MONTH_OPTIONS: { value: string; label: string }[] = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export function yearOptions(): { value: string; label: string }[] {
  const current = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => {
    const y = current - i;
    return { value: String(y), label: String(y) };
  });
}

/** Monthly / yearly period picker. Wire `query` output into ExportButton. */
export function PeriodFilter({
  period,
  year,
  month,
  onPeriodChange,
  onYearChange,
  onMonthChange,
}: {
  period: PeriodValue;
  year: string;
  month: string;
  onPeriodChange: (value: PeriodValue) => void;
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
}) {
  return (
    <>
      <TableFilter
        label="Period"
        value={period}
        options={PERIOD_OPTIONS}
        onChange={(v) => onPeriodChange(v as PeriodValue)}
      />
      {period !== "all" && (
        <TableFilter label="Year" value={year} options={yearOptions()} onChange={onYearChange} />
      )}
      {period === "monthly" && (
        <TableFilter label="Month" value={month} options={MONTH_OPTIONS} onChange={onMonthChange} />
      )}
    </>
  );
}

/** True when `dateIso` falls inside the selected period (creation-date basis). */
export function inSelectedPeriod(
  dateIso: string | null | undefined,
  period: PeriodValue,
  year: string,
  month: string
): boolean {
  if (period === "all" || !dateIso) return period === "all" ? true : false;
  const y = Number(year);
  if (!Number.isInteger(y)) return false;
  const t = new Date(dateIso).getTime();
  if (Number.isNaN(t)) return false;
  if (period === "yearly") {
    return t >= new Date(y, 0, 1).getTime() && t < new Date(y + 1, 0, 1).getTime();
  }
  const m = Number(month);
  if (!Number.isInteger(m) || m < 1 || m > 12) return false;
  return t >= new Date(y, m - 1, 1).getTime() && t < new Date(y, m, 1).getTime();
}

/** Query params for ExportButton so the download matches the selected period. */
export function periodQuery(
  period: PeriodValue,
  year: string,
  month: string
): Record<string, string> {
  if (period === "all") return {};
  if (period === "monthly") return { period, year, month };
  return { period, year };
}

export function SortableTh({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: string;
  activeKey: string;
  dir: SortDir;
  onSort: (key: string) => void;
  className?: string;
}) {
  const active = activeKey === sortKey;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      title={`Sort by ${label}`}
      className={`inline-flex items-center gap-1 font-semibold hover:text-gray-900 ${active ? "text-gray-900" : ""} ${className}`}
    >
      {label}
      {active ? (
        dir === "asc" ? (
          <ArrowUp className="size-3.5" />
        ) : (
          <ArrowDown className="size-3.5" />
        )
      ) : (
        <ArrowUpDown className="size-3.5 opacity-40" />
      )}
    </button>
  );
}

export function TableFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="hidden font-medium lg:inline">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="sm" className="h-8 min-w-32 bg-white" aria-label={label}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export function ClearFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={onClick} className="gap-1 text-xs">
      <X className="size-3.5" />
      Clear
    </Button>
  );
}

export function ResultCount({ shown, total, itemName }: { shown: number; total: number; itemName: string }) {
  return (
    <p className="text-xs text-muted-foreground" aria-live="polite">
      Showing <span className="font-semibold text-foreground">{shown}</span> of{" "}
      <span className="font-semibold text-foreground">{total}</span> {itemName}
    </p>
  );
}

export function ExportButton({
  dataset,
  query,
  label = "Export Excel",
}: {
  dataset: "children" | "donors" | "donations" | "payments" | "sponsorships" | "all";
  query?: Record<string, string>;
  label?: string;
}) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams({ dataset });
      if (query) {
        for (const [k, v] of Object.entries(query)) {
          if (v && v !== "ALL" && v !== "all") params.set(k, v);
        }
      }
      const res = await fetch(`/api/admin/export?${params.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Export failed.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `reclaim-hope-${dataset}.xlsx`;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Excel report downloaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={exporting}
      className="gap-2 bg-white"
    >
      <Download className="size-4" />
      {exporting ? "Preparing…" : label}
    </Button>
  );
}
