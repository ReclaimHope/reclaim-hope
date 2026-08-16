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
import { CheckCircle2, CircleOff } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import React from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useSWR, {mutate} from "swr"


export function CreateChildDialog() {
    enum SponsorshipStatus {
        Sponsored = "Sponsored",
        NotSponsored = "NotSponsored",
    }
    const [sponsorshipStatus, setSponsorshipStatus] = React.useState<SponsorshipStatus>
    (SponsorshipStatus.NotSponsored)
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();
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

            const data = { firstName, lastName, dateOfBirth, dream, imageUrl, summary, story, sponsorshipStatus };
            const response = await fetch('/api/children', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) {
                console.error("Error creating child:", result.error);
                toast.error("Failed to create child. Please try again.");
            } else {
                toast.success("Child created successfully!");
                setSponsorshipStatus(SponsorshipStatus.NotSponsored);
                mutate('/api/children');
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
                    className="bg-black text-white cursor-pointer hover:bg-gray-500  hover:text-white"
                    variant="outline"
                >
                    <Plus />
                    Create Child
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[90vw] md:w-[70vw] max-w-none">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add a Child</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new child.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="Enter child's first name"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Enter child's last name"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="age">Date of Birth</Label>
                            <Input
                                id="age"
                                type="date"
                                name="dateOfBirth"
                                placeholder="Enter date of birth"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="dream">Dream</Label>
                            <Input
                                id="dream"
                                name="dream"
                                placeholder="Dream profession"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="imageUrl">Image Link</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                placeholder="https://..."
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="status">Sponsorship Status</Label>

                            <Select value={sponsorshipStatus} onValueChange={(value) => setSponsorshipStatus(value as SponsorshipStatus)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value={SponsorshipStatus.Sponsored}>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>Sponsored</span>
                                        </div>
                                    </SelectItem>

                                    <SelectItem value={SponsorshipStatus.NotSponsored}>
                                        <div className="flex items-center gap-2">
                                            <CircleOff className="h-4 w-4 text-gray-500" />
                                            <span>Not Sponsored</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field className="md:col-span-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea
                                id="summary"
                                name="summary"
                                rows={3}
                                placeholder="Short summary..."
                            />
                        </Field>

                        <Field className="md:col-span-2">
                            <Label htmlFor="story">Story</Label>
                            <Textarea
                                id="story"
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
                            {isLoading ? "Saving..." : "Save Child"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}