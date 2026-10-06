'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import {
  getSponsorshipPlan,
  SponsorshipCurrencyType,
  SponsorshipFrequencyType,
} from "@/lib/sponsorship-plans"
import {
  expireStaleSponsorships,
  getCoverageEndDate,
} from "@/lib/sponsorship-helpers"
import {
  createIremboInvoice,
  getIremboConfig,
} from "@/lib/payments/iremboPay"

export interface DonorInput {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  country?: string
  address?: string
}

export interface CreateSponsorshipRequestInput {
  childId: string
  donor: DonorInput
  frequency: SponsorshipFrequencyType
  /** ISO date string (YYYY-MM-DD) picked by the sponsor. */
  startDate: string
  /** Optional number of charges; omitted = indefinite until cancelled. */
  chargesCount?: number | null
}

export interface CreatePendingSponsorshipInput {
  childId: string
  donor: DonorInput
  frequency: SponsorshipFrequencyType
  currency: SponsorshipCurrencyType
}

function generateReference(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Fetch all children with their live sponsorship availability status.
 * DB-only: when the database has no children (or is unreachable),
 * an empty list is returned — no hardcoded fallback children.
 */
export async function getChildrenWithStatus() {
  try {
    await expireStaleSponsorships()
    const dbChildren = await prisma.child.findMany({
      include: {
        sponsorships: {
          where: {
            status: "ACTIVE",
            OR: [{ endedAt: null }, { endedAt: { gt: new Date() } }],
          },
          include: { donor: true },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return dbChildren.map((c) => {
      const activeSponsorship = c.sponsorships && c.sponsorships.length > 0 ? c.sponsorships[0] : null
      return {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        name: `${c.firstName} ${c.lastName}`.trim(),
        dateOfBirth: c.dateOfBirth.toISOString(),
        age: calculateAge(c.dateOfBirth),
        dream: c.dream,
        imageUrl: c.imageUrl || "/mentors_kids.jpg",
        story: c.story,
        isSponsored: !!activeSponsorship,
        sponsorName: activeSponsorship
          ? `${activeSponsorship.donor.firstName} ${activeSponsorship.donor.lastName}`.trim()
          : null,
        activeSponsorship: activeSponsorship
          ? {
              id: activeSponsorship.id,
              amount: Number(activeSponsorship.amount),
              frequency: activeSponsorship.frequency,
              startedAt: activeSponsorship.startedAt?.toISOString() || null,
            }
          : null,
      }
    })
  } catch (error) {
    console.error("Database connection issue fetching children:", error)
    return []
  }
}

function calculateAge(dateOfBirth: Date): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return Math.max(0, age)
}

/**
 * Check if a child is available for sponsorship.
 * Rule: One child can have only one active sponsor.
 */
export async function checkChildAvailability(childId: string) {
  try {
    await expireStaleSponsorships(childId)
    const activeSponsorship = await prisma.sponsorship.findFirst({
      where: {
        childId,
        status: "ACTIVE",
        OR: [{ endedAt: null }, { endedAt: { gt: new Date() } }],
      },
    })
    return { isAvailable: !activeSponsorship, activeSponsorship }
  } catch (error) {
    console.error("Error checking child availability:", error)
    return { isAvailable: true, activeSponsorship: null }
  }
}

/**
 * Step 1: Sponsor submits a subscription request (no online payment).
 * Creates a PENDING sponsorship with a unique internal subscription
 * reference. The admin copies that reference into the IremboPay dashboard
 * ("Subscription Reference") when manually creating the customer +
 * subscription there, then activates the request here.
 */
export async function createSponsorshipRequest(input: CreateSponsorshipRequestInput) {
  try {
    const { childId, donor: donorInput, frequency, startDate, chargesCount } = input

    if (!donorInput.firstName || !donorInput.lastName || !donorInput.email) {
      return { success: false, error: "Please provide first name, last name, and a valid email address." }
    }

    const plan = getSponsorshipPlan(frequency)
    if (!plan) {
      return { success: false, error: "Please choose a valid sponsorship plan (Monthly or Yearly)." }
    }

    // Validate requested start date (must be a real date, not in the past)
    const parsedStart = new Date(`${startDate}T00:00:00`)
    if (!startDate || isNaN(parsedStart.getTime())) {
      return { success: false, error: "Please choose a valid subscription start date." }
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (parsedStart < today) {
      return { success: false, error: "The subscription start date cannot be in the past." }
    }

    // Validate optional charge count
    let charges: number | null = null
    if (chargesCount !== undefined && chargesCount !== null && String(chargesCount) !== "") {
      charges = Number(chargesCount)
      if (!Number.isInteger(charges) || charges < 1) {
        return { success: false, error: "Number of charges must be a whole number of 1 or more (or left blank for indefinite)." }
      }
    }

    // Child must exist in the database (no hardcoded fallback children)
    const child = await prisma.child.findUnique({
      where: { id: childId },
    })

    if (!child) {
      return { success: false, error: "Selected child was not found." }
    }

    // Business Rule Check: One child can have only one active sponsor
    const existingActiveSponsorship = await prisma.sponsorship.findFirst({
      where: {
        childId: child.id,
        status: "ACTIVE",
      },
    })

    if (existingActiveSponsorship) {
      return {
        success: false,
        error: `${child.firstName} currently has an active sponsor and cannot be sponsored again at this time.`,
      }
    }

    // Business Rule: One donor can sponsor multiple children (upsert donor record)
    const cleanEmail = donorInput.email.trim().toLowerCase()
    let donor = await prisma.donor.findFirst({
      where: { email: cleanEmail },
    })

    if (donor) {
      donor = await prisma.donor.update({
        where: { id: donor.id },
        data: {
          firstName: donorInput.firstName.trim(),
          lastName: donorInput.lastName.trim(),
          phoneNumber: donorInput.phoneNumber?.trim() || null,
          country: donorInput.country?.trim() || null,
          address: donorInput.address?.trim() || null,
        },
      })
    } else {
      donor = await prisma.donor.create({
        data: {
          firstName: donorInput.firstName.trim(),
          lastName: donorInput.lastName.trim(),
          email: cleanEmail,
          phoneNumber: donorInput.phoneNumber?.trim() || null,
          country: donorInput.country?.trim() || null,
          address: donorInput.address?.trim() || null,
        },
      })
    }

    // Unique internal reference — the admin pastes this into the IremboPay
    // dashboard "Subscription Reference" field.
    const reference = generateReference("SPON")

    const sponsorship = await prisma.sponsorship.create({
      data: {
        donorId: donor.id,
        childId: child.id,
        amount: plan.amount,
        currency: plan.currency,
        frequency,
        status: "PENDING",
        subscriptionReference: reference,
        requestedStartDate: parsedStart,
        chargesCount: charges,
      },
    })

    revalidatePath("/sponsor")
    revalidatePath("/admin/sponsors")

    return {
      success: true,
      sponsorship: {
        id: sponsorship.id,
        amount: Number(sponsorship.amount),
        currency: sponsorship.currency,
        frequency: sponsorship.frequency,
        status: sponsorship.status,
        subscriptionReference: sponsorship.subscriptionReference,
        requestedStartDate: sponsorship.requestedStartDate?.toISOString() || null,
        chargesCount: sponsorship.chargesCount,
      },
      child: {
        id: child.id,
        name: `${child.firstName} ${child.lastName}`.trim(),
        dream: child.dream,
        imageUrl: child.imageUrl,
      },
      donor: {
        id: donor.id,
        name: `${donor.firstName} ${donor.lastName}`.trim(),
        email: donor.email,
      },
    }
  } catch (error: unknown) {
    console.error("Error creating sponsorship request:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to submit sponsorship request." }
  }
}

/**
 * Step 1: Sponsor pays for one coverage period via the IremboPay widget
 * (same one-time invoice flow as donations, same RWF/USD accounts +
 * product identifiers — selected by currency).
 *
 * Creates a PENDING sponsorship + PENDING payment, then an IremboPay
 * invoice. On successful payment (webhook or status poll) the sponsorship
 * becomes ACTIVE until startedAt + 30/365 days.
 */
export async function createPendingSponsorship(input: CreatePendingSponsorshipInput) {
  try {
    const { childId, donor: donorInput, frequency, currency } = input

    if (!donorInput.firstName?.trim() || !donorInput.lastName?.trim() || !donorInput.email?.trim()) {
      return { success: false, error: "Please provide first name, last name, and a valid email address." }
    }

    if (frequency !== "MONTHLY" && frequency !== "YEARLY") {
      return { success: false, error: "Please choose a valid sponsorship plan (Monthly or Yearly)." }
    }
    if (currency !== "USD" && currency !== "RWF") {
      return { success: false, error: "Currency must be either RWF or USD." }
    }

    const plan = getSponsorshipPlan(frequency, currency)
    if (!plan) {
      return { success: false, error: "Selected plan is not available." }
    }

    const child = await prisma.child.findUnique({ where: { id: childId } })
    if (!child) {
      return { success: false, error: "Selected child was not found." }
    }

    await expireStaleSponsorships(child.id)

    // Business Rule: one child can have only one active (unexpired) sponsor.
    const existingActiveSponsorship = await prisma.sponsorship.findFirst({
      where: {
        childId: child.id,
        status: "ACTIVE",
        OR: [{ endedAt: null }, { endedAt: { gt: new Date() } }],
      },
    })
    if (existingActiveSponsorship) {
      return {
        success: false,
        error: `${child.firstName} currently has an active sponsor and cannot be sponsored again at this time.`,
      }
    }

    // Upsert donor by email (one donor may sponsor multiple children).
    const cleanEmail = donorInput.email.trim().toLowerCase()
    let donor = await prisma.donor.findFirst({ where: { email: cleanEmail } })
    if (donor) {
      donor = await prisma.donor.update({
        where: { id: donor.id },
        data: {
          firstName: donorInput.firstName.trim(),
          lastName: donorInput.lastName.trim(),
          phoneNumber: donorInput.phoneNumber?.trim() || null,
          country: donorInput.country?.trim() || null,
          address: donorInput.address?.trim() || null,
        },
      })
    } else {
      donor = await prisma.donor.create({
        data: {
          firstName: donorInput.firstName.trim(),
          lastName: donorInput.lastName.trim(),
          email: cleanEmail,
          phoneNumber: donorInput.phoneNumber?.trim() || null,
          country: donorInput.country?.trim() || null,
          address: donorInput.address?.trim() || null,
        },
      })
    }

    const reference = generateReference("SPON")

    const { sponsorship, payment } = await prisma.$transaction(async (tx) => {
      const newSponsorship = await tx.sponsorship.create({
        data: {
          donorId: donor.id,
          childId: child.id,
          amount: plan.amount,
          currency: plan.currency,
          frequency,
          status: "PENDING",
          subscriptionReference: reference,
        },
      })
      const newPayment = await tx.payment.create({
        data: {
          sponsorshipId: newSponsorship.id,
          reference,
          amount: plan.amount,
          currency: plan.currency,
          provider: "IPAY",
          status: "PENDING",
        },
      })
      return { sponsorship: newSponsorship, payment: newPayment }
    })

    const donorName = `${donor.firstName} ${donor.lastName}`.trim()
    const invoice = await createIremboInvoice({
      transactionId: payment.reference,
      amount: plan.amount,
      currency: plan.currency as "RWF" | "USD",
      description: `Sponsorship (${frequency}) for ${child.firstName} ${child.lastName} - Reclaim Hope`,
      customer: {
        name: donorName,
        email: donor.email || undefined,
        phoneNumber: donor.phoneNumber || undefined,
      },
    })

    await prisma.payment.update({
      where: { id: payment.id },
      data: { transactionId: invoice.invoiceNumber },
    })

    const config = getIremboConfig()

    revalidatePath("/sponsor")
    revalidatePath("/admin/sponsors")
    revalidatePath("/admin/payments")

    return {
      success: true,
      publicKey: config.publicKey,
      environment: config.environment,
      sponsorship: {
        id: sponsorship.id,
        amount: plan.amount,
        currency: plan.currency,
        frequency: sponsorship.frequency,
        status: sponsorship.status,
        coverageDays: plan.days,
      },
      payment: {
        id: payment.id,
        reference: payment.reference,
        amount: plan.amount,
        currency: plan.currency,
        status: payment.status,
        invoiceNumber: invoice.invoiceNumber,
        paymentLinkUrl: invoice.paymentLinkUrl || null,
      },
      child: {
        id: child.id,
        name: `${child.firstName} ${child.lastName}`.trim(),
      },
    }
  } catch (error: unknown) {
    console.error("Error creating pending sponsorship:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to initiate sponsorship payment." }
  }
}

/**
 * Admin: list all sponsorship requests with donor + child details,
 * newest first. Used by /admin/sponsors.
 */
export async function getSponsorshipRequests() {
  try {
    const sponsorships = await prisma.sponsorship.findMany({
      include: {
        donor: true,
        child: true,
        payments: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    })

    return sponsorships.map((s) => ({
      id: s.id,
      amount: Number(s.amount),
      currency: s.currency,
      frequency: s.frequency,
      status: s.status,
      subscriptionReference: s.subscriptionReference,
      requestedStartDate: s.requestedStartDate?.toISOString() || null,
      chargesCount: s.chargesCount,
      startedAt: s.startedAt?.toISOString() || null,
      endedAt: s.endedAt?.toISOString() || null,
      createdAt: s.createdAt.toISOString(),
      donor: {
        id: s.donor.id,
        name: `${s.donor.firstName} ${s.donor.lastName}`.trim(),
        email: s.donor.email,
        phoneNumber: s.donor.phoneNumber,
        country: s.donor.country,
        address: s.donor.address,
      },
      child: {
        id: s.child.id,
        name: `${s.child.firstName} ${s.child.lastName}`.trim(),
      },
      latestPayment: s.payments[0]
        ? {
            id: s.payments[0].id,
            reference: s.payments[0].reference,
            invoiceNumber: s.payments[0].transactionId,
            status: s.payments[0].status,
            paidAt: s.payments[0].paidAt?.toISOString() || null,
          }
        : null,
      paymentsCount: s.payments.length,
    }))
  } catch (error) {
    console.error("Error fetching sponsorship requests:", error)
    return []
  }
}

/**
 * Admin: manually activate a PENDING sponsorship (legacy manual-dashboard
 * rows, or edge cases where online payment was verified offline).
 * Grants the standard coverage period from now.
 */
export async function activateSponsorshipRequest(sponsorshipId: string) {
  try {
    const sponsorship = await prisma.sponsorship.findUnique({
      where: { id: sponsorshipId },
    })

    if (!sponsorship) {
      return { success: false, error: "Sponsorship request not found." }
    }
    if (sponsorship.status !== "PENDING") {
      return { success: false, error: `Only pending requests can be activated (current status: ${sponsorship.status}).` }
    }

    await expireStaleSponsorships(sponsorship.childId)

    // Guard: child must still have no other active sponsor
    const conflicting = await prisma.sponsorship.findFirst({
      where: {
        childId: sponsorship.childId,
        status: "ACTIVE",
        OR: [{ endedAt: null }, { endedAt: { gt: new Date() } }],
      },
    })
    if (conflicting) {
      return { success: false, error: "This child already has another active sponsor." }
    }

    const startedAt = new Date()
    await prisma.sponsorship.update({
      where: { id: sponsorship.id },
      data: {
        status: "ACTIVE",
        startedAt,
        endedAt: getCoverageEndDate(sponsorship.frequency as SponsorshipFrequencyType, startedAt),
      },
    })

    revalidatePath("/sponsor")
    revalidatePath("/admin/sponsors")
    revalidatePath("/admin/children")

    return { success: true }
  } catch (error: unknown) {
    console.error("Error activating sponsorship:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to activate sponsorship." }
  }
}

/**
 * Admin: cancel a PENDING request (sponsor changed mind / invalid details)
 * or end an ACTIVE sponsorship (sets endedAt).
 */
export async function cancelSponsorshipRequest(sponsorshipId: string) {
  try {
    const sponsorship = await prisma.sponsorship.findUnique({
      where: { id: sponsorshipId },
    })

    if (!sponsorship) {
      return { success: false, error: "Sponsorship request not found." }
    }
    if (sponsorship.status !== "PENDING" && sponsorship.status !== "ACTIVE") {
      return { success: false, error: `Only pending or active sponsorships can be cancelled (current status: ${sponsorship.status}).` }
    }

    await prisma.sponsorship.update({
      where: { id: sponsorship.id },
      data: {
        status: "CANCELLED",
        endedAt: sponsorship.status === "ACTIVE" ? new Date() : undefined,
      },
    })

    revalidatePath("/sponsor")
    revalidatePath("/admin/sponsors")
    revalidatePath("/admin/children")

    return { success: true }
  } catch (error: unknown) {
    console.error("Error cancelling sponsorship:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to cancel sponsorship." }
  }
}

/* NOTE: Sponsorships are paid as ONE-TIME IremboPay invoices (same widget
 * flow as donations). A successful payment activates the sponsorship for
 * its coverage period (30 / 365 days). activateSponsorshipRequest remains
 * for legacy manual rows / offline-verified edge cases. */
