// app/actions.ts
'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteChildAction(id: string) {
    try {
        // Direct database access on the server
        await prisma.child.delete({ where: { id } })

        // Automatically refetch data for the specified path to update the UI
        revalidatePath('/children')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete child" }
    }
}
export async function updateChildAction(id: string, formData: FormData) {
    try {
        const firstName = String(formData.get("firstName") ?? "").trim()
        const lastName = String(formData.get("lastName") ?? "").trim()
        const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim()
        const dream = String(formData.get("dream") ?? "").trim()
        const imageUrl = String(formData.get("imageUrl") ?? "").trim()
        const summary = String(formData.get("summary") ?? "").trim()
        const story = String(formData.get("story") ?? "").trim()
        const sponsorshipStatus = String(formData.get("sponsorshipStatus") ?? "NotSponsored").trim()

        if (!firstName || !lastName || !dateOfBirth || !dream || !summary || !story) {
            return { success: false, error: "Please fill in all required fields." }
        }

        const data = {
            firstName,
            lastName,
            dateOfBirth: new Date(dateOfBirth),
            dream,
            imageUrl: imageUrl || null,
            summary,
            story,
            sponsorshipStatus: sponsorshipStatus === "Sponsored" ? "Sponsored" : "NotSponsored",
        }

        await prisma.child.update({
            where: { id },
            data,
        })

        revalidatePath('/children')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error("Error updating child:", error)
        return { success: false, error: "Failed to update child" }
    }
}