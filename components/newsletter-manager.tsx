"use client"

import { useMemo, useState, useTransition } from "react"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageDropzone } from "@/components/image-drop-area"
import { createNewsletterAction, deleteNewsletterAction, updateNewsletterAction } from "@/app/actions/newsletters"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Newsletter = {
  id: string
  title: string
  summary: string
  imageUrl: string | null
  pdfUrl: string | null
  createdAt: Date | string
}

type NewsletterFormProps = {
  newsletter?: Newsletter
  onSaved: () => void
}

function getImageSrc(imageUrl: string) {
  if (/^(https?:|blob:|data:)/.test(imageUrl) || imageUrl.startsWith("/")) {
    return imageUrl
  }

  return `/api/r2/${imageUrl}`
}

function getFileSrc(fileUrl: string) {
  if (/^(https?:|blob:|data:)/.test(fileUrl) || fileUrl.startsWith("/")) {
    return fileUrl
  }

  return `/api/r2/${fileUrl}`
}

function NewsletterForm({ newsletter, onSaved }: NewsletterFormProps) {
  const [images, setImages] = useState<File[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, startSaving] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (images[0]) formData.append("image", images[0])

    startSaving(async () => {
      const response = newsletter
        ? await updateNewsletterAction(newsletter.id, formData)
        : await createNewsletterAction(formData)

      if (!response.success) {
        toast.error(response.error)
        return
      }

      toast.success(newsletter ? "Newsletter updated successfully." : "Newsletter created successfully.")
      setImages([])
      setIsOpen(false)
      onSaved()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {newsletter ? (
          <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${newsletter.title}`}>
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button type="button" className="gap-2 bg-black text-white hover:bg-gray-800">
            <Plus className="size-4" />
            Add Newsletter
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="h-[85vh] max-h-[85vh] w-[90vw] overflow-y-auto sm:w-[80vw] sm:max-w-225">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{newsletter ? "Edit Newsletter" : "Add Newsletter"}</DialogTitle>
            <DialogDescription>
              {newsletter ? "Update the newsletter details, thumbnail, or PDF." : "Add a title, summary, thumbnail, and PDF."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="my-4 grid grid-cols-1 gap-4">
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={newsletter?.title} placeholder="Newsletter title" required />
            </Field>

            <Field>
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" name="summary" defaultValue={newsletter?.summary} rows={5} placeholder="Briefly describe this newsletter..." required />
            </Field>

            <Field>
              <Label>Image or Thumbnail</Label>
              <ImageDropzone
                value={images}
                onChange={setImages}
                maxFiles={1}
                existingImageUrl={newsletter?.imageUrl}
              />
            </Field>

            <Field>
              <Label htmlFor="pdf">Whole Newsletter PDF</Label>
              <Input id="pdf" name="pdf" type="file" accept="application/pdf" required={!newsletter} />
              {newsletter?.pdfUrl && (
                <a
                  href={getFileSrc(newsletter.pdfUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-brand-green hover:underline"
                >
                  Open current PDF
                </a>
              )}
              <p className="text-xs text-muted-foreground">PDF files up to 25 MB.</p>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving} className="bg-yellow-500 font-semibold text-white hover:bg-yellow-600">
              {isSaving ? "Saving..." : newsletter ? "Save Changes" : "Save Newsletter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function NewsletterManager({ initialNewsletters }: { initialNewsletters: Newsletter[] }) {
  const [newsletters, setNewsletters] = useState(initialNewsletters)
  const [isDeleting, startDeleting] = useTransition()
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"newest" | "oldest" | "title">("newest")

  const refresh = async () => {
    const response = await fetch("/api/admin/newsletters", { cache: "no-store" })
    if (response.ok) setNewsletters(await response.json())
  }

  const handleDelete = (newsletter: Newsletter) => {
    if (!window.confirm(`Delete "${newsletter.title}"?`)) return

    startDeleting(async () => {
      const response = await deleteNewsletterAction(newsletter.id)
      if (!response.success) {
        toast.error(response.error)
        return
      }
      toast.success("Newsletter deleted successfully.")
      setNewsletters((current) => current.filter((item) => item.id !== newsletter.id))
    })
  }

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = newsletters.filter(
      (n) => !q || n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
    );
    return [...rows].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "oldest" ? diff : -diff;
    });
  }, [newsletters, search, sort]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Newsletters</h1>
          <p className="text-sm text-gray-500">Publish and maintain newsletter updates for your community.</p>
        </div>
        <NewsletterForm onSaved={refresh} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search newsletters…"
            aria-label="Search newsletters"
            className="bg-white pl-9"
          />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger size="sm" className="h-8 min-w-40 bg-white" aria-label="Sort newsletters">
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
          <span className="font-semibold text-foreground">{newsletters.length}</span> newsletters
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
          {newsletters.length === 0 ? "No newsletters have been added yet." : "No newsletters match your search."}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((newsletter) => (
            <article key={newsletter.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {newsletter.imageUrl ? (
                <img src={getImageSrc(newsletter.imageUrl)} alt="" className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center bg-gray-100 text-sm text-gray-500">No thumbnail</div>
              )}
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">{newsletter.title}</h2>
                  <div className="flex shrink-0 items-center gap-1">
                    <NewsletterForm newsletter={newsletter} onSaved={refresh} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${newsletter.title}`}
                      disabled={isDeleting}
                      onClick={() => handleDelete(newsletter)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-gray-600">{newsletter.summary}</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-400">{new Date(newsletter.createdAt).toLocaleDateString()}</p>
                  {newsletter.pdfUrl && (
                    <a
                      href={getFileSrc(newsletter.pdfUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-brand-green hover:underline"
                    >
                      Open PDF
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
