import { Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteChildAction } from "@/app/actions";
import { toast } from "sonner"
import { mutate } from "swr"
import { useState } from "react"

export default function DeleteChildDialog({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteChild = async () => {
    if (isDeleting) return

    setIsDeleting(true)

    try {
      const result = await deleteChildAction(id)

      if (!result.success) {
        toast.error(result.error || "Failed to delete child")
        return
      }

      toast.success("Child deleted successfully!")
      await mutate("/api/children")
    } catch (error) {
      console.error("Error deleting child:", error)
      toast.error("Failed to delete child. Please try again.")
      setIsDeleting(false)
    } 
    finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
        >
          <Trash2Icon className="mr-2 h-4 w-4" />
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete child?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this child. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteChild}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
