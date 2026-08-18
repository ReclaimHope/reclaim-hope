import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Plus } from "lucide-react"
import { CheckCircle2, CircleOff } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import React from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useSWR, { mutate } from "swr"
import { updateChildAction } from "@/app/actions"

type childProps = {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dream: string;
    imageUrl: string;
    summary: string;
    story: string;
}


export function UpdateChildDialog({ child }: { child: childProps }) {
    enum SponsorshipStatus {
        Sponsored = "Sponsored",
        NotSponsored = "NotSponsored",
    }

    const formatDateForInput = (value: string) => {
        if (!value) return ""

        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return ""

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        return `${year}-${month}-${day}`
    }

    const [isLoading, setIsLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsLoading(true);
            const formData = new FormData(e.currentTarget);
            const firstName = String(formData.get("firstName") ?? "").trim();
            const lastName = String(formData.get("lastName") ?? "").trim();
            const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim();
            const dream = String(formData.get("dream") ?? "").trim();
            const imageUrl = String(formData.get("imageUrl") ?? "").trim();
            const summary = String(formData.get("summary") ?? "").trim();
            const story = String(formData.get("story") ?? "").trim();

            if (!firstName || !lastName || !dateOfBirth || !dream || !summary || !story) {
                toast.error("Please fill in all required fields.");
                return;
            }

            const response = await updateChildAction(child.id, formData);
            if (!response.success) {
                toast.error(response.error || "Failed to update child")
                return
            }

            toast.success("Child updated successfully!")
            await mutate("/api/children")
            setIsOpen(false)
        } catch (error) {
            console.error("Error updating child:", error);
            toast.error("Failed to update child. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-brand-green outline-none transition-colors hover:bg-green-400/10 focus:bg-green-400/10"
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </button>
            </DialogTrigger>

            <DialogContent className="w-[90vw] md:w-[70vw] max-w-none">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Child</DialogTitle>
                        <DialogDescription>
                            Update the details for the child.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                defaultValue={child.firstName}
                                name="firstName"
                                placeholder="Enter child's first name"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                defaultValue={child.lastName}
                                name="lastName"
                                placeholder="Enter child's last name"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="age">Date of Birth</Label>
                            <Input
                                id="age"
                                defaultValue={formatDateForInput(child.dateOfBirth)}
                                type="date"
                                name="dateOfBirth"
                                placeholder="Enter date of birth"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="dream">Dream</Label>
                            <Input
                                id="dream"
                                defaultValue={child.dream}
                                name="dream"
                                placeholder="Dream profession"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="imageUrl">Image Link</Label>
                            <Input
                                id="imageUrl"
                                defaultValue={child.imageUrl}
                                name="imageUrl"
                                type="url"
                                placeholder="https://..."
                            />
                        </Field>

                        <Field className="md:col-span-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea
                                id="summary"
                                defaultValue={child.summary}
                                name="summary"
                                rows={3}
                                placeholder="Short summary..."
                            />
                        </Field>

                        <Field className="md:col-span-2">
                            <Label htmlFor="story">Story</Label>
                            <Textarea
                                id="story"
                                defaultValue={child.story}
                                name="story"
                                rows={10}
                                placeholder="Tell the child's story..."
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}