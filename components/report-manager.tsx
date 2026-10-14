"use client"

import { useMemo, useState, useTransition } from "react"
import { Download, FileText, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createReportAction, deleteReportAction, updateReportAction } from "@/app/actions/reports"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Report = {
  id: string
  title: string
  fileUrl: string
  createdAt: Date | string
}

function getFileSrc(fileUrl: string) {
  if (/^(https?:|blob:|data:)/.test(fileUrl) || fileUrl.startsWith("/")) return fileUrl
  return `/${fileUrl}`
}

function ReportForm({ report, onSaved }: { report?: Report; onSaved: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, startSaving] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startSaving(async () => {
      const response = report
        ? await updateReportAction(report.id, formData)
        : await createReportAction(formData)
      if (!response.success) {
        toast.error(response.error)
        return
      }
      toast.success(report ? "Report updated successfully." : "Report uploaded successfully.")
      setIsOpen(false)
      onSaved()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {report ? (
          <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${report.title}`}>
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button type="button" className="gap-2 bg-black text-white hover:bg-gray-800">
            <Plus className="size-4" />
            Add Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{report ? "Edit Report" : "Add Report"}</DialogTitle>
            <DialogDescription>
              {report ? "Update the report title or replace its file." : "Upload a report with a clear title."}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="my-4 grid gap-4">
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={report?.title} placeholder="Annual report 2025" required />
            </Field>
            <Field>
              <Label htmlFor="file">Report File</Label>
              <Input id="file" name="file" type="file" required={!report} />
              {report && <p className="text-xs text-muted-foreground">Leave empty to keep the current file.</p>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit" disabled={isSaving} className="bg-yellow-500 font-semibold text-white hover:bg-yellow-600">
              {isSaving ? "Saving..." : report ? "Save Changes" : "Upload Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ReportManager({ initialReports }: { initialReports: Report[] }) {
  const [reports, setReports] = useState(initialReports)
  const [isDeleting, startDeleting] = useTransition()
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"newest" | "oldest" | "title">("newest")

  const refresh = async () => {
    const response = await fetch("/api/admin/reports", { cache: "no-store" })
    if (response.ok) setReports(await response.json())
  }

  const handleDelete = (report: Report) => {
    if (!window.confirm(`Delete "${report.title}"?`)) return
    startDeleting(async () => {
      const response = await deleteReportAction(report.id)
      if (!response.success) {
        toast.error(response.error)
        return
      }
      toast.success("Report deleted successfully.")
      setReports((current) => current.filter((item) => item.id !== report.id))
    })
  }

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = reports.filter((r) => !q || r.title.toLowerCase().includes(q));
    return [...rows].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "oldest" ? diff : -diff;
    });
  }, [reports, search, sort]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Reports</h1>
          <p className="text-sm text-gray-500">Upload and maintain organization reports.</p>
        </div>
        <ReportForm onSaved={refresh} />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by title…"
            aria-label="Search reports"
            className="bg-white pl-9"
          />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger size="sm" className="h-8 min-w-40 bg-white" aria-label="Sort reports">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="title">Title A–Z</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground sm:ml-auto" aria-live="polite">
          Showing <span className="font-semibold text-foreground">{visible.length}</span> of{" "}
          <span className="font-semibold text-foreground">{reports.length}</span> reports
        </p>
      </div>
      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
          {reports.length === 0 ? "No reports have been uploaded yet." : "No reports match your search."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {visible.map((report) => (
              <div key={report.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-yellow-700"><FileText className="size-5" /></div>
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-gray-900">{report.title}</h2>
                    <p className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:shrink-0">
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={getFileSrc(report.fileUrl)} target="_blank" rel="noreferrer"><Download className="size-4" />Open file</a>
                  </Button>
                  <ReportForm report={report} onSaved={refresh} />
                  <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${report.title}`} disabled={isDeleting} onClick={() => handleDelete(report)}>
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
