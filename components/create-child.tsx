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

export function CreateChildDialog() {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button
                        className="bg-black text-white cursor-pointer hover:bg-gray-500 hover:text-white"
                        variant="outline"
                    >
                        <Plus />
                        Create Child
                    </Button>
                </DialogTrigger>

                <DialogContent className="w-[90vw] md:w-[70vw] max-w-none">
                    <DialogHeader>
                        <DialogTitle>Add a Child</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new child.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                            <Label htmlFor="names">Names</Label>
                            <Input
                                id="names"
                                placeholder="Enter child's names"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                min={1}
                                placeholder="Enter age"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="dream">Dream</Label>
                            <Input
                                id="dream"
                                placeholder="Dream profession"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="imageUrl">Image Link</Label>
                            <Input
                                id="imageUrl"
                                type="url"
                                placeholder="https://..."
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="status">Sponsorship Status</Label>

                            <Select>
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
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea
                                id="summary"
                                rows={3}
                                placeholder="Short summary..."
                            />
                        </Field>

                        <Field className="md:col-span-2">
                            <Label htmlFor="story">Story</Label>
                            <Textarea
                                id="story"
                                rows={10}
                                placeholder="Tell the child's story..."
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
                            Save Child
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}