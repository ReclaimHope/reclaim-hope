"use client"

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
import { Plus } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import React from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { mutate } from "swr"
import { ImageDropzone } from "@/components/image-drop-area"

export function CreateChildDialog() {
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();
    const [isOpen, setIsOpen] = React.useState(false);
    const [images, setImages] = React.useState<File[]>([]);

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
            const story = String(formData.get("story") ?? "").trim();

            if (!firstName || !lastName || !dateOfBirth || !dream) {
                toast.error("Please fill in all required fields.");
                return;
            }

            if (images[0]) {
                formData.append("image", images[0]);
            }

            const response = await fetch('/api/children', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) {
                console.error("Error creating child:", result.error);
                toast.error(result.error || "Failed to create child. Please try again.");
            } else {
                toast.success("Child created successfully!");
                mutate('/api/children');
                setImages([]);
                setIsOpen(false);
                router.refresh();
            }
        } catch (error) {
            console.error("Error creating child:", error);
            toast.error("Failed to create child. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
                <Button
                    type="button"
                    className="bg-black text-white cursor-pointer hover:bg-gray-800 hover:text-white"
                    variant="outline"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Child
                </Button>
            </DialogTrigger>

            <DialogContent className="h-[85vh] max-h-[85vh] w-[90vw] overflow-y-auto sm:w-[80vw] sm:max-w-[900px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add a Child</DialogTitle>
                        <DialogDescription>
                            Fill in the profile details for the child.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        <Field>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="Enter child's first name"
                                required
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Enter child's last name"
                                required
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                name="dateOfBirth"
                                placeholder="Enter date of birth"
                                required
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="dream">Dream</Label>
                            <Input
                                id="dream"
                                name="dream"
                                placeholder="e.g. Doctor, Software Developer, Pilot"
                                required
                            />
                        </Field>

                        <Field className="md:col-span-2">
                            <Label>Child Image</Label>
                            <ImageDropzone value={images} onChange={setImages} maxFiles={1} />
                        </Field>

                        <Field className="md:col-span-2">
                            <Label htmlFor="story">Story</Label>
                            <Textarea
                                id="story"
                                name="story"
                                rows={6}
                                placeholder="Tell the child's story in detail..."
                                required
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={isLoading} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold">
                            {isLoading ? "Saving..." : "Save Child"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}