import { prisma } from "@/lib/prisma"
import {
  getSponsorshipPeriodDays,
  SponsorshipFrequencyType,
} from "@/lib/sponsorship-plans"

/**
 * Marks ACTIVE sponsorships whose coverage period has lapsed as COMPLETED
 * so the child becomes available again. One-time payments grant a fixed
 * coverage window (30 / 365 days); there is no auto-renewal.
 *
 * NOTE: lives outside `app/actions/*` on purpose — `'use server'` modules
 * may only export async Server Actions, so plain helpers must live here.
 */
export async function expireStaleSponsorships(childId?: string) {
  try {
    await prisma.sponsorship.updateMany({
      where: {
        status: "ACTIVE",
        endedAt: { lte: new Date() },
        ...(childId ? { childId } : {}),
      },
      data: { status: "COMPLETED" },
    })
  } catch (error) {
    console.warn("Failed to expire stale sponsorships:", error)
  }
}

/** Coverage end date for a payment starting now. */
export function getCoverageEndDate(frequency: SponsorshipFrequencyType, from: Date = new Date()): Date {
  const end = new Date(from)
  end.setDate(end.getDate() + getSponsorshipPeriodDays(frequency))
  return end
}
