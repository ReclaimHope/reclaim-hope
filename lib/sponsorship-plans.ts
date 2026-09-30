export type SponsorshipFrequencyType = 'MONTHLY' | 'YEARLY'

/**
 * Sponsorship plans. IremboPay offers no subscription API, so these mirror
 * the plans the admin creates manually in the IremboPay dashboard
 * (e.g. "monthly sponsorship USD"). Amounts must stay in sync with the
 * dashboard plans.
 */
export const SPONSORSHIP_PLANS = [
  { frequency: 'MONTHLY' as SponsorshipFrequencyType, amount: 78, currency: 'USD', label: 'Monthly', description: '$78 every month' },
  { frequency: 'YEARLY' as SponsorshipFrequencyType, amount: 936, currency: 'USD', label: 'Yearly', description: '$936 once a year ($78 x 12)' },
] as const

export function getSponsorshipPlan(frequency: SponsorshipFrequencyType) {
  return SPONSORSHIP_PLANS.find((p) => p.frequency === frequency) || null
}
