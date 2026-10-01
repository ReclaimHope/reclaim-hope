'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import {
  createIremboInvoice,
  getIremboConfig,
  fetchIremboInvoiceDetails,
  parseIremboDate,
} from "@/lib/payments/iremboPay"

export type DonationCategoryType = 'MEALS' | 'HEALTH' | 'EDUCATION' | 'LOVE_GIFT'

export interface DonorInfoInput {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  address?: string | null
  country?: string | null
  message?: string | null
}

export interface CreateDonationInput {
  category: DonationCategoryType
  amount: number
  currency: 'USD' | 'RWF'
  donor?: DonorInfoInput
}

function generateReference(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Step 1-6: Create Pending Donation, Pending Payment, and IremboPay Invoice
 * Returns invoice and public key for the frontend IremboPay widget
 */
export async function createPendingDonation(input: CreateDonationInput) {
  try {
    const { category, amount, currency, donor: donorInput } = input

    // 1. Validate Category
    const allowedCategories: DonationCategoryType[] = ['MEALS', 'HEALTH', 'EDUCATION', 'LOVE_GIFT']
    if (!category || !allowedCategories.includes(category)) {
      return {
        success: false,
        error: "Please choose a valid donation purpose (Meals, Health, Education, or Love Gift).",
      }
    }

    // 2. Validate Amount
    const parsedAmount = Number(amount)
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return { success: false, error: "Please enter a valid donation amount." }
    }

    // 3. Validate Currency
    if (currency !== 'RWF' && currency !== 'USD') {
      return { success: false, error: "Currency must be either RWF or USD." }
    }

    // 4. Handle Donor Record (Safe upsert using findFirst to respect DB schema)
    let donor = null
    if (donorInput?.email && donorInput?.firstName && donorInput?.lastName) {
      const cleanEmail = donorInput.email.trim().toLowerCase()
      const existingDonor = await prisma.donor.findFirst({
        where: { email: cleanEmail },
      })

      if (existingDonor) {
        donor = await prisma.donor.update({
          where: { id: existingDonor.id },
          data: {
            firstName: donorInput.firstName.trim(),
            lastName: donorInput.lastName.trim(),
            phoneNumber: donorInput.phoneNumber?.trim() || null,
            address: donorInput.address?.trim() || null,
            country: donorInput.country?.trim() || null,
          },
        })
      } else {
        donor = await prisma.donor.create({
          data: {
            firstName: donorInput.firstName.trim(),
            lastName: donorInput.lastName.trim(),
            email: cleanEmail,
            phoneNumber: donorInput.phoneNumber?.trim() || null,
            address: donorInput.address?.trim() || null,
            country: donorInput.country?.trim() || null,
          },
        })
      }
    }

    // 5. Generate internal payment reference
    const reference = generateReference("DON")

    // 6. Create Donation (PENDING) and Payment (PENDING) in a transaction
    const { donation, payment } = await prisma.$transaction(async (tx) => {
      const newDonation = await tx.donation.create({
        data: {
          donorId: donor ? donor.id : null,
          amount: parsedAmount,
          currency,
          category,
          status: "PENDING",
        },
      })

      const newPayment = await tx.payment.create({
        data: {
          donationId: newDonation.id,
          reference,
          amount: parsedAmount,
          currency,
          provider: "IPAY",
          status: "PENDING",
        },
      })

      return { donation: newDonation, payment: newPayment }
    })

    // 7. Create IremboPay Invoice via dedicated service
    const donorName = donor ? `${donor.firstName} ${donor.lastName}`.trim() : "Anonymous Donor"
    const invoice = await createIremboInvoice({
      transactionId: payment.reference,
      amount: parsedAmount,
      currency,
      description: `Donation: ${category.replace("_", " ")} - Reclaim Hope`,
      customer: {
        name: donorName,
        email: donor?.email || undefined,
        phoneNumber: donor?.phoneNumber || undefined,
      },
    })

    // 8. Save IremboPay invoice number to payment for tracking
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        transactionId: invoice.invoiceNumber,
      },
    })

    const config = getIremboConfig()

    revalidatePath("/donate")
    revalidatePath("/admin/donations")
    revalidatePath("/admin/payments")

    return {
      success: true,
      publicKey: config.publicKey,
      environment: config.environment,
      donation: {
        id: donation.id,
        category: donation.category,
        amount: Number(donation.amount),
        currency: donation.currency,
        status: donation.status,
      },
      payment: {
        id: payment.id,
        reference: payment.reference,
        amount: Number(payment.amount),
        currency: payment.currency,
        status: payment.status,
        invoiceNumber: invoice.invoiceNumber,
        paymentLinkUrl: invoice.paymentLinkUrl || null,
      },
    }
  } catch (error: unknown) {
    console.error("Error creating pending donation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initiate donation with IremboPay.",
    }
  }
}

/**
 * Checks authoritative payment status from database and cross-checks IremboPay API if needed.
 */
export async function getPaymentStatusAction(referenceOrInvoice: string) {
  try {
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { reference: referenceOrInvoice },
          { id: referenceOrInvoice },
          { transactionId: referenceOrInvoice },
        ],
      },
      include: {
        donation: true,
      },
    })

    if (!payment) {
      return { success: false, error: "Payment not found" }
    }

    // If still PENDING in DB, check IremboPay API directly in case webhook was delayed.
    // THROTTLED: each check costs a ~2s external API call, and the frontend
    // polls every 2.5s. Only re-query IremboPay if the row hasn't been
    // checked in the last 20s (tracked via updatedAt, touched after every
    // check). The webhook remains the primary confirmation path.
    if (payment.status === "PENDING" && payment.transactionId) {
      const RECHECK_INTERVAL_MS = 20_000;
      const lastChecked = payment.updatedAt ? payment.updatedAt.getTime() : 0;
      if (Date.now() - lastChecked >= RECHECK_INTERVAL_MS) {
        try {
          const details = await fetchIremboInvoiceDetails(payment.transactionId)
          if (details.paymentStatus.toUpperCase() === "PAID") {
          // Authoritative paid: transition in DB
          await prisma.$transaction(async (tx) => {
            await tx.payment.update({
              where: { id: payment.id },
              data: {
                status: "SUCCESSFUL",
                paidAt: parseIremboDate(details.paidAt),
              },
            })

            if (payment.donationId) {
              await tx.donation.update({
                where: { id: payment.donationId },
                data: { status: "COMPLETED" },
              })
            }
          })

          revalidatePath("/donate")
          revalidatePath("/admin/donations")
          revalidatePath("/admin/payments")

          return {
            success: true,
            status: "SUCCESSFUL",
            donationStatus: "COMPLETED",
            paidAt: details.paidAt || new Date().toISOString(),
          }
        }

          // Still pending upstream: record the check time so the next poll
          // waits out the throttle window instead of hammering IremboPay.
          await prisma.payment.update({
            where: { id: payment.id },
            data: { updatedAt: new Date() },
          });
        } catch (err) {
          console.warn("Status check against IremboPay API failed:", err)
        }
      }
    }

    return {
      success: true,
      status: payment.status,
      donationStatus: payment.donation?.status || null,
      paidAt: payment.paidAt?.toISOString() || null,
    }
  } catch (error) {
    console.error("Error checking payment status:", error)
    return { success: false, error: "Failed to check payment status" }
  }
}

/**
 * Fetch all donations with donor and payment history for admin.
 */
export async function getDonationsList() {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        donor: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return donations.map((d) => ({
      id: d.id,
      amount: Number(d.amount),
      currency: d.currency,
      category: d.category,
      status: d.status,
      createdAt: d.createdAt.toISOString(),
      donor: d.donor
        ? {
            name: `${d.donor.firstName} ${d.donor.lastName}`.trim(),
            email: d.donor.email,
            country: d.donor.country,
          }
        : null,
      latestPayment: d.payments[0]
        ? {
            id: d.payments[0].id,
            reference: d.payments[0].reference,
            status: d.payments[0].status,
            paidAt: d.payments[0].paidAt?.toISOString() || null,
          }
        : null,
    }))
  } catch (error) {
    console.error("Error fetching donations list:", error)
    return []
  }
}
