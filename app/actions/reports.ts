'use server'

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { verifyAdminSession } from "@/lib/auth"
import { r2, R2_BUCKET_NAME } from "@/lib/r2"

const MAX_REPORT_SIZE = 50 * 1024 * 1024

function getStorageKey(fileUrl: string | null) {
  if (!fileUrl) return null
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "")
  if (publicUrl && fileUrl.startsWith(`${publicUrl}/`)) {
    return fileUrl.slice(publicUrl.length + 1)
  }
  return fileUrl.startsWith("reports/") ? fileUrl : null
}

async function uploadReport(file: File) {
  if (!file || file.size === 0 || file.size > MAX_REPORT_SIZE) {
    return { error: "Report file is required and must be no larger than 50 MB." }
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
  const key = `reports/${Date.now()}-${safeName}`
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type || "application/octet-stream",
    })
  )

  return {
    url: process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
      : key,
  }
}

async function deleteReportFile(fileUrl: string | null) {
  const key = getStorageKey(fileUrl)
  if (key) await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
}

export async function createReportAction(formData: FormData) {
  try {
    await verifyAdminSession()
    const title = String(formData.get("title") ?? "").trim()
    const file = formData.get("file")
    if (!title) return { success: false, error: "Report title is required." }
    if (!(file instanceof File)) return { success: false, error: "A report file is required." }

    const uploaded = await uploadReport(file)
    if (uploaded.error || !uploaded.url) return { success: false, error: uploaded.error || "Upload failed" }

    await prisma.report.create({ data: { title, fileUrl: uploaded.url } })
    revalidatePath("/admin/reports")
    return { success: true }
  } catch (error) {
    console.error("Error creating report:", error)
    return { success: false, error: "Failed to create report." }
  }
}

export async function updateReportAction(id: string, formData: FormData) {
  try {
    await verifyAdminSession()
    const title = String(formData.get("title") ?? "").trim()
    const file = formData.get("file")
    if (!title) return { success: false, error: "Report title is required." }

    const report = await prisma.report.findUnique({ where: { id } })
    if (!report) return { success: false, error: "Report not found." }

    let fileUrl = report.fileUrl
    if (file instanceof File && file.size > 0) {
      const uploaded = await uploadReport(file)
      if (uploaded.error || !uploaded.url) return { success: false, error: uploaded.error || "Upload failed" }
      fileUrl = uploaded.url
      await deleteReportFile(report.fileUrl)
    }

    await prisma.report.update({ where: { id }, data: { title, fileUrl } })
    revalidatePath("/admin/reports")
    return { success: true }
  } catch (error) {
    console.error("Error updating report:", error)
    return { success: false, error: "Failed to update report." }
  }
}

export async function deleteReportAction(id: string) {
  try {
    await verifyAdminSession()
    const report = await prisma.report.findUnique({ where: { id }, select: { fileUrl: true } })
    if (!report) return { success: false, error: "Report not found." }

    await prisma.report.delete({ where: { id } })
    await deleteReportFile(report.fileUrl)
    revalidatePath("/admin/reports")
    return { success: true }
  } catch (error) {
    console.error("Error deleting report:", error)
    return { success: false, error: "Failed to delete report." }
  }
}