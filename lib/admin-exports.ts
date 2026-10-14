import ExcelJS from "exceljs";

export type ExportDataset =
  | "children"
  | "donors"
  | "donations"
  | "payments"
  | "sponsorships"
  | "all";

export interface ExportColumn {
  header: string;
  key: string;
  width: number;
}

export interface SheetSpec {
  name: string;
  title: string;
  columns: ExportColumn[];
  rows: Record<string, string | number | null | undefined>[];
  /** Zero-based index of the amount column for a totals row, or null. */
  totalAmountKey?: string | null;
}

const BRAND_GREEN = "FF14532D";
const BRAND_GOLD = "FFB45309";
const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: BRAND_GREEN },
};
const TITLE_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF0FDF4" },
};
const ALT_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF8FAFC" },
};
const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FFE2E8F0" } },
  left: { style: "thin", color: { argb: "FFE2E8F0" } },
  bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
  right: { style: "thin", color: { argb: "FFE2E8F0" } },
};

function styleSheet(
  ws: ExcelJS.Worksheet,
  spec: SheetSpec,
  meta: { generatedAt: string; filterSummary: string }
) {
  const colCount = spec.columns.length;
  const lastCol = colCount > 0 ? ws.getColumn(colCount).letter : "A";

  // Title row
  ws.mergeCells(`A1:${lastCol}1`);
  const titleCell = ws.getCell("A1");
  titleCell.value = `Reclaim Hope — ${spec.title}`;
  titleCell.font = { bold: true, size: 16, color: { argb: BRAND_GREEN } };
  titleCell.fill = TITLE_FILL;
  titleCell.alignment = { vertical: "middle" };
  ws.getRow(1).height = 28;

  // Subtitle row: generated date + filters + count
  ws.mergeCells(`A2:${lastCol}2`);
  const subCell = ws.getCell("A2");
  subCell.value = `Generated ${meta.generatedAt}  •  ${spec.rows.length} record(s)  •  Filters: ${meta.filterSummary}`;
  subCell.font = { size: 10, color: { argb: "FF475569" }, italic: true };
  subCell.alignment = { vertical: "middle", wrapText: true };
  ws.getRow(2).height = 20;

  // Column widths
  spec.columns.forEach((col, i) => {
    ws.getColumn(i + 1).width = col.width;
  });

  // Header row (row 4, row 3 is spacer)
  const headerRow = ws.getRow(4);
  spec.columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col.header;
    cell.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
    cell.fill = HEADER_FILL;
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    cell.border = THIN_BORDER;
  });
  headerRow.height = 22;

  // Data rows start at row 5
  spec.rows.forEach((row, idx) => {
    const excelRow = ws.getRow(5 + idx);
    spec.columns.forEach((col, colIdx) => {
      const cell = excelRow.getCell(colIdx + 1);
      const value = row[col.key];
      cell.value = value ?? "—";
      cell.font = { size: 11, color: { argb: "FF1E293B" } };
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.border = THIN_BORDER;
      if (idx % 2 === 1) cell.fill = ALT_FILL;
    });
    excelRow.height = 18;
  });

  const firstDataRow = 5;
  const lastDataRow = 5 + spec.rows.length - 1;

  // Totals row for amount sheets
  if (spec.totalAmountKey && spec.rows.length > 0) {
    const amountColIdx = spec.columns.findIndex((c) => c.key === spec.totalAmountKey);
    if (amountColIdx >= 0) {
      const totalRow = ws.getRow(lastDataRow + 1);
      const labelCell = totalRow.getCell(1);
      labelCell.value = `TOTAL (${spec.rows.length} records)`;
      labelCell.font = { bold: true, size: 11, color: { argb: BRAND_GREEN } };
      labelCell.alignment = { horizontal: "right", vertical: "middle" };
      const colLetter = ws.getColumn(amountColIdx + 1).letter;
      const sumCell = totalRow.getCell(amountColIdx + 1);
      sumCell.value = { formula: `SUM(${colLetter}${firstDataRow}:${colLetter}${lastDataRow})` };
      sumCell.font = { bold: true, size: 12, color: { argb: BRAND_GREEN } };
      sumCell.numFmt = "#,##0.00";
      for (let i = 1; i <= colCount; i++) {
        totalRow.getCell(i).border = THIN_BORDER;
        totalRow.getCell(i).fill = TITLE_FILL;
      }
      totalRow.height = 20;
    }
  }

  // Footer
  const footerRowIdx = lastDataRow + (spec.totalAmountKey ? 2 : 1);
  ws.mergeCells(`A${footerRowIdx}:${lastCol}${footerRowIdx}`);
  const footer = ws.getCell(`A${footerRowIdx}`);
  footer.value = "Reclaim Hope Admin Console — confidential internal report";
  footer.font = { size: 9, italic: true, color: { argb: "FF94A3B8" } };

  // Freeze below header + autofilter
  ws.views = [{ state: "frozen", ySplit: 4 }];
  if (spec.rows.length > 0) {
    ws.autoFilter = {
      from: { row: 4, column: 1 },
      to: { row: lastDataRow, column: colCount },
    };
  }

  ws.pageSetup.orientation = "landscape";
  ws.pageSetup.paperSize = 9;
  ws.pageSetup.fitToWidth = 1;
  ws.pageSetup.fitToHeight = 0;
}

export async function buildExportWorkbook(
  sheets: SheetSpec[],
  filterSummary: string
): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Reclaim Hope Admin Console";
  wb.created = new Date();
  const generatedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  for (const spec of sheets) {
    const ws = wb.addWorksheet(spec.name.slice(0, 31));
    styleSheet(ws, spec, { generatedAt, filterSummary });
  }
  // Brand the first sheet tab
  wb.eachSheet((ws, id) => {
    ws.properties.tabColor = { argb: id === 1 ? BRAND_GOLD : BRAND_GREEN };
  });
  return wb;
}

export function sheetSpecsForDataset(
  dataset: Exclude<ExportDataset, "all">,
  rows: Record<string, string | number | null | undefined>[]
): SheetSpec {
  switch (dataset) {
    case "children":
      return {
        name: "Children",
        title: "Children Register",
        columns: [
          { header: "Full Name", key: "name", width: 26 },
          { header: "Date of Birth", key: "dateOfBirth", width: 16 },
          { header: "Age (yrs)", key: "age", width: 11 },
          { header: "Dream", key: "dream", width: 24 },
          { header: "Status", key: "status", width: 14 },
          { header: "Active Sponsor", key: "sponsor", width: 26 },
          { header: "Registered", key: "createdAt", width: 16 },
        ],
        rows,
      };
    case "donors":
      return {
        name: "Donors",
        title: "Donors",
        columns: [
          { header: "Full Name", key: "name", width: 26 },
          { header: "Email", key: "email", width: 30 },
          { header: "Phone", key: "phone", width: 20 },
          { header: "Country", key: "country", width: 18 },
          { header: "Donations (completed/total)", key: "donations", width: 24 },
          { header: "Donated Amount", key: "donatedAmount", width: 18 },
          { header: "Active Sponsorships", key: "activeSponsorships", width: 20 },
          { header: "Joined", key: "createdAt", width: 16 },
        ],
        rows,
      };
    case "donations":
      return {
        name: "Donations",
        title: "Donations",
        columns: [
          { header: "Donor", key: "donor", width: 26 },
          { header: "Email", key: "email", width: 30 },
          { header: "Category", key: "category", width: 16 },
          { header: "Amount", key: "amount", width: 16 },
          { header: "Currency", key: "currency", width: 11 },
          { header: "Status", key: "status", width: 14 },
          { header: "Payment Ref", key: "paymentRef", width: 24 },
          { header: "Date", key: "createdAt", width: 16 },
        ],
        rows,
        totalAmountKey: "amount",
      };
    case "payments":
      return {
        name: "Payments",
        title: "Payments",
        columns: [
          { header: "Reference", key: "reference", width: 26 },
          { header: "Transaction ID", key: "transactionId", width: 24 },
          { header: "Donor", key: "donor", width: 26 },
          { header: "Source", key: "source", width: 30 },
          { header: "Amount", key: "amount", width: 16 },
          { header: "Currency", key: "currency", width: 11 },
          { header: "Status", key: "status", width: 14 },
          { header: "Paid At", key: "paidAt", width: 16 },
          { header: "Created", key: "createdAt", width: 16 },
        ],
        rows,
        totalAmountKey: "amount",
      };
    case "sponsorships":
      return {
        name: "Sponsorships",
        title: "Sponsorships",
        columns: [
          { header: "Donor", key: "donor", width: 26 },
          { header: "Donor Email", key: "email", width: 30 },
          { header: "Child", key: "child", width: 24 },
          { header: "Amount", key: "amount", width: 16 },
          { header: "Currency", key: "currency", width: 11 },
          { header: "Frequency", key: "frequency", width: 13 },
          { header: "Status", key: "status", width: 14 },
          { header: "Payment Ref", key: "paymentRef", width: 24 },
          { header: "Started", key: "startedAt", width: 16 },
          { header: "Ends", key: "endedAt", width: 16 },
          { header: "Requested", key: "createdAt", width: 16 },
        ],
        rows,
        totalAmountKey: "amount",
      };
  }
}
