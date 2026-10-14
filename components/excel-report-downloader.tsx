"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExportButton,
  MONTH_OPTIONS,
  PeriodFilter,
  periodQuery,
  type PeriodValue,
} from "@/components/admin-table-controls";

const DATASETS = [
  { value: "all", label: "Full report — all sheets (Summary + 5 tables)" },
  { value: "children", label: "Children register" },
  { value: "donors", label: "Donors" },
  { value: "donations", label: "Donations" },
  { value: "payments", label: "Payments" },
  { value: "sponsorships", label: "Sponsorships" },
] as const;

export function ExcelReportDownloader() {
  const [dataset, setDataset] = useState<(typeof DATASETS)[number]["value"]>("all");
  const [period, setPeriod] = useState<PeriodValue>("all");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));

  const query: Record<string, string> = periodQuery(period, year, month);

  return (
    <Card className="border-emerald-900/10 bg-gradient-to-br from-emerald-50/60 to-white">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileSpreadsheet className="size-5 text-emerald-700" />
            Excel reports
          </CardTitle>
          <CardDescription>
            Download a well-formatted Excel workbook with a title block, styled headers,
            frozen panes, filters, column widths and totals. The full report includes a
            Summary sheet plus one sheet per table. Choose a period to scope the report
            to a specific month or year.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Select value={dataset} onValueChange={(v) => setDataset(v as typeof dataset)}>
            <SelectTrigger className="w-full bg-white lg:w-96" aria-label="Choose Excel report">
              <SelectValue placeholder="Choose report" />
            </SelectTrigger>
            <SelectContent>
              {DATASETS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap items-center gap-3">
            <PeriodFilter
              period={period}
              year={year}
              month={month}
              onPeriodChange={setPeriod}
              onYearChange={setYear}
              onMonthChange={setMonth}
            />
          </div>
          <div className="lg:ml-auto">
            <ExportButton dataset={dataset} query={query} label="Download Excel" />
          </div>
        </div>
        {period !== "all" && (
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Exporting records created in{" "}
            <span className="font-semibold text-foreground">
              {period === "monthly"
                ? `${MONTH_OPTIONS.find((m) => m.value === month)?.label} ${year}`
                : year}
            </span>
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
}
