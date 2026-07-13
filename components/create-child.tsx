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
import { useState } from "react"
import { toast } from "sonner"


export function CreateChildDialog() {
    const [status, setStatus] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())
        console.log(data);
        try {
            const response = await fetch("/api/child", {
                method: "POST",
                body: JSON.stringify({
                    ...data,
                    status,
                }),
                headers: {
                    "content-type": "application/json",
                }
            })

            if (response.ok) {
                toast.success("Child added successfully!")
            }
            else {
                toast.error("An error occurred while adding the child.")
            }
        }
        catch (error) {
            toast.error("server error.")
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    className="bg-black text-white cursor-pointer hover:bg-gray-500 hover:text-white"
                    variant="outline"
                >
                    <Plus />
                    Create Child
                </Button>
            </DialogTrigger>



            <DialogContent><form onSubmit={async (e) => {
                e.preventDefault();
                await handleSubmit(e);
            }}>
                <DialogHeader>
                    <DialogTitle>Add a Child</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new child.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            placeholder="Enter child's first name"
                            name="firstName"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            placeholder="Enter child's last name"
                            name="lastName"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                            id="dob"
                            type="date"
                            name="dob"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="dream">Dream</Label>
                        <Input
                            id="dream"
                            placeholder="Dream profession"
                            name="dream"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="imageUrl">Image Link</Label>
                        <Input
                            id="imageUrl"
                            type="url"
                            placeholder="https://..."
                            name="imageUrl"
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="status">Sponsorship Status</Label>

                        <Select
                            value={status}
                            onValueChange={setStatus}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="sponsored">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span>Sponsored</span>
                                    </div>
                                </SelectItem>

                                <SelectItem value="not-sponsored">
                                    <div className="flex items-center gap-2">
                                        <CircleOff className="h-4 w-4 text-gray-500" />
                                        <span>Not Sponsored</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field className="md:col-span-2">
                        <Label htmlFor="story">Story</Label>
                        <Textarea
                            id="story"
                            rows={10}
                            placeholder="Tell the child's story..."
                            name="story"
                        />
                    </Field>
                </FieldGroup>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button type="submit">
                        Add Child
                    </Button>
                </DialogFooter>
            </form>
            </DialogContent>

        </Dialog>
    )
}