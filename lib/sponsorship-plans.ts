export type SponsorshipFrequencyType = 'MONTHLY' | 'YEARLY'

export type SponsorshipCurrencyType = 'USD' | 'RWF'

export interface SponsorshipPlan {
  frequency: SponsorshipFrequencyType
  currency: SponsorshipCurrencyType
  amount: number
  label: string
  description: string
  /** Coverage period in days granted by one successful one-time payment. */
  days: number
}

/**
 * Sponsorship plans charged as ONE-TIME IremboPay invoices (no subscription
 * API). Each successful payment grants coverage for `days` (30 = monthly,
 * 365 = yearly), after which the sponsorship lapses and the child becomes
 * available again. Amounts are charged via the matching RWF / USD payment
 * account + product identifier already configured for donations.
 */
export const SPONSORSHIP_PLANS: SponsorshipPlan[] = [
  { frequency: 'MONTHLY', currency: 'USD', amount: 78, label: 'Monthly', description: '$78 every month', days: 30 },
  { frequency: 'MONTHLY', currency: 'RWF', amount: 100000, label: 'Monthly', description: '100,000 RWF every month', days: 30 },
  { frequency: 'YEARLY', currency: 'USD', amount: 936, label: 'Yearly', description: '$936 once a year ($78 x 12)', days: 365 },
  { frequency: 'YEARLY', currency: 'RWF', amount: 1200000, label: 'Yearly', description: '1,200,000 RWF once a year', days: 365 },
]

export function getSponsorshipPlan(
  frequency: SponsorshipFrequencyType,
  currency: SponsorshipCurrencyType = 'USD',
) {
  return SPONSORSHIP_PLANS.find((p) => p.frequency === frequency && p.currency === currency) || null
}

export function getSponsorshipPlansForFrequency(frequency: SponsorshipFrequencyType) {
  return SPONSORSHIP_PLANS.filter((p) => p.frequency === frequency)
}

/** Coverage days granted by one successful payment for the given frequency. */
export function getSponsorshipPeriodDays(frequency: SponsorshipFrequencyType): number {
  return frequency === 'YEARLY' ? 365 : 30
}

export function formatSponsorshipAmount(amount: number, currency: SponsorshipCurrencyType): string {
  if (currency === 'RWF') return `${amount.toLocaleString('en-US')} RWF`
  return `$${amount.toLocaleString('en-US')}`
}
