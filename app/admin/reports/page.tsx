import { ReportManager } from "@/components/report-manager"
import { ExcelReportDownloader } from "@/components/excel-report-downloader"
import { prisma } from "@/lib/prisma"

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    select: { id: true, title: true, fileUrl: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <ExcelReportDownloader />
      <ReportManager initialReports={reports} />
    </div>
  )
}
