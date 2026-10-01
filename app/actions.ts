// app/actions.ts
'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { verifyAdminSession } from "@/lib/auth"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2, R2_BUCKET_NAME } from "@/lib/r2"

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

export async function deleteChildAction(id: string) {
    try {
        await verifyAdminSession();
        // Direct database access on the server
        await prisma.child.delete({ where: { id } })

        // Automatically refetch data for the specified path to update the UI
        revalidatePath('/admin/children')
        revalidatePath('/sponsor')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete child" }
    }
}

export async function updateChildAction(id: string, formData: FormData) {
    try {
        await verifyAdminSession();
        const firstName = String(formData.get("firstName") ?? "").trim()
        const lastName = String(formData.get("lastName") ?? "").trim()
        const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim()
        const dream = String(formData.get("dream") ?? "").trim()
        const story = String(formData.get("story") ?? "").trim()
        const image = formData.get("image")

        if (!firstName || !lastName || !dateOfBirth || !dream || !story) {
            return { success: false, error: "Please fill in all required fields." }
        }

        if (image instanceof File && (!ACCEPTED_IMAGE_TYPES.includes(image.type) || image.size > MAX_IMAGE_SIZE)) {
            return { success: false, error: "Image must be JPG, PNG, WebP, or AVIF and no larger than 10 MB." }
        }

        const existingChild = await prisma.child.findUnique({
            where: { id },
            select: { imageUrl: true },
        })
        if (!existingChild) {
            return { success: false, error: "Child not found" }
        }

        let imageUrl = existingChild.imageUrl
        if (image instanceof File) {
            const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "-")
            const key = `children/${Date.now()}-${safeName}`
            await r2.send(
                new PutObjectCommand({
                    Bucket: R2_BUCKET_NAME,
                    Key: key,
                    Body: Buffer.from(await image.arrayBuffer()),
                    ContentType: image.type,
                })
            )
            imageUrl = process.env.R2_PUBLIC_URL
                ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
                : key
        }

        const data = {
            firstName,
            lastName,
            dateOfBirth: new Date(dateOfBirth),
            dream,
            imageUrl,
            story,
        }

        await prisma.child.update({
            where: { id },
            data,
        })

        revalidatePath('/admin/children')
        revalidatePath('/sponsor')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error("Error updating child:", error)
        return { success: false, error: "Failed to update child" }
    }
}