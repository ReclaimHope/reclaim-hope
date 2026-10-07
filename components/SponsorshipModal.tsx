'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  X,
  User,
  Mail,
  Calendar,
  Loader2,
  LockKeyhole,
  AlertCircle,
} from 'lucide-react'
import {
  SPONSORSHIP_PLANS,
  SponsorshipCurrencyType,
  SponsorshipFrequencyType,
  formatSponsorshipAmount,
} from '@/lib/sponsorship-plans'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SponsorshipModalProps {
  isOpen: boolean
  onClose: () => void
  child: {
    id: string
    name: string
    age: number
    dream: string
    image: string
    isSponsored?: boolean
  }
}

type Step = 'plan' | 'sponsor_info' | 'review' | 'done'

type PaymentState =
  | 'idle'
  | 'preparing'
  | 'widget_opened'
  | 'confirmation_pending'
  | 'confirmed'
  | 'failed'
  | 'cancelled'

const STEPS: { id: Step; label: string }[] = [
  { id: 'plan', label: 'Plan' },
  { id: 'sponsor_info', label: 'Your Details' },
  { id: 'review', label: 'Pay' },
  { id: 'done', label: 'Done' },
]

export default function SponsorshipModal({
  isOpen,
  onClose,
  child,
}: SponsorshipModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('plan')
  const [frequency, setFrequency] = useState<SponsorshipFrequencyType>('MONTHLY')
  const [currency, setCurrency] = useState<SponsorshipCurrencyType>('USD')
  const [donor, setDonor] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: 'Rwanda',
    address: '',
  })
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)

  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [paymentReference, setPaymentReference] = useState<string | null>(null)
  const [paymentLinkBackup, setPaymentLinkBackup] = useState<string | null>(null)
  const [coverageEnd, setCoverageEnd] = useState<string | null>(null)

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const selectedPlan =
    SPONSORSHIP_PLANS.find((p) => p.frequency === frequency && p.currency === currency) ??
    SPONSORSHIP_PLANS[0]

  const handleModalClose = () => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    onClose()
    setTimeout(() => {
      setStep('plan')
      setPaymentState('idle')
      setInvoiceNumber(null)
      setPaymentReference(null)
      setCoverageEnd(null)
    }, 300)
  }

  // Close on Escape + lock body scroll while open
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleModalClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  if (!isOpen) return null

  const stepIndex = STEPS.findIndex((s) => s.id === step)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setDonor((prev) => ({ ...prev, [name]: value }))
  }

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!donor.firstName.trim() || !donor.lastName.trim() || !donor.email.trim()) {
      toast.error('Please complete all required fields.')
      return
    }
    if (!donor.phoneNumber.trim()) {
      toast.error('Please provide your phone number.')
      return
    }
    setStep('review')
  }

  const launchWidget = (invNum: string, pubKey: string, ref: string) => {
    if (typeof window === 'undefined' || !window.IremboPay) {
      toast.error('IremboPay payment widget is still loading. Please try again in a moment.')
      setPaymentState('failed')
      return
    }

    setPaymentState('widget_opened')

    try {
      window.IremboPay.initiate({
        publicKey: pubKey,
        invoiceNumber: invNum,
        locale: window.IremboPay.locale?.EN || 'EN',
        callback: (error: unknown, response: unknown) => {
          if (error) {
            const errObj = error as { code?: string; message?: string }
            const respObj = response as { errors?: { code?: string; detail?: string }[]; message?: string } | null
            const code = errObj.code || respObj?.errors?.[0]?.code
            const detail =
              errObj.message ||
              respObj?.errors?.[0]?.detail ||
              respObj?.message ||
              'Payment could not be completed.'
            if (errObj.code === 'USER_CANCELLED' || errObj.message?.includes('cancel')) {
              setPaymentState('cancelled')
              toast.info('Payment was cancelled.')
            } else {
              setPaymentState('failed')
              toast.error(code ? `Payment failed (${code}): ${detail}` : detail)
            }
          } else {
            setPaymentState('confirmation_pending')
            toast.success('Payment submitted! Confirming your sponsorship...')
            startStatusPolling(ref)
          }
        },
      })
    } catch (widgetError: unknown) {
      setPaymentState('failed')
      toast.error('Failed to open payment modal: ' + (widgetError instanceof Error ? widgetError.message : 'Unknown error'))
    }
  }

  const startStatusPolling = (ref: string) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)

    let attempts = 0
    const maxAttempts = 24 // 24 * 2.5s = 60s

    pollingIntervalRef.current = setInterval(async () => {
      attempts++
      try {
        const response = await fetch(`/api/payments/status?reference=${encodeURIComponent(ref)}`)
        if (response.ok) {
          const data = await response.json()
          if (data.status === 'SUCCESSFUL') {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
            setPaymentState('confirmed')
            const days = frequency === 'YEARLY' ? 365 : 30
            const end = new Date()
            end.setDate(end.getDate() + days)
            setCoverageEnd(end.toLocaleDateString())
            setStep('done')
            toast.success(`Thank you! ${child.name}'s sponsorship is now active.`)
            router.refresh()
            return
          }
          if (data.status === 'FAILED' || data.status === 'CANCELLED') {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
            setPaymentState(data.status === 'CANCELLED' ? 'cancelled' : 'failed')
            return
          }
        }

        if (attempts >= maxAttempts) {
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
          setPaymentState('confirmation_pending')
          toast.info('Payment received! Final confirmation is processing in the background.')
        }
      } catch (err) {
        console.warn('Status poll error:', err)
      }
    }, 2500)
  }

  const handlePay = async () => {
    if (!acceptedPolicy) {
      toast.error('Please accept the Refund & Cancellation Policy before continuing.')
      return
    }
    try {
      setPaymentState('preparing')
      const response = await fetch('/api/sponsorships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: child.id,
          frequency,
          currency,
          firstName: donor.firstName.trim(),
          lastName: donor.lastName.trim(),
          email: donor.email.trim(),
          phoneNumber: donor.phoneNumber.trim(),
          country: donor.country.trim(),
          address: donor.address.trim(),
          acceptedPolicy,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to initialize sponsorship payment.')
      }

      const invNum = result.invoiceNumber
      const pubKey = result.publicKey
      const ref = result.reference || result.payment?.reference

      setInvoiceNumber(invNum)
      setPublicKey(pubKey)
      setPaymentReference(ref)
      setPaymentLinkBackup(result.paymentLinkUrl || null)

      toast.success('Invoice prepared. Launching secure payment widget...')
      launchWidget(invNum, pubKey, ref)
    } catch (err: unknown) {
      setPaymentState('failed')
      toast.error(err instanceof Error ? err.message : 'An unexpected error occurred.')
    }
  }

  const handleReopenWidget = () => {
    if (invoiceNumber && publicKey && paymentReference) {
      launchWidget(invoiceNumber, publicKey, paymentReference)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Sponsor ${child.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={handleModalClose}
      />

      {/* Panel */}
      <div className="relative flex w-[min(1200px,96vw)] h-[min(860px,94vh)] overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={handleModalClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
        >
          <X className="size-5" />
        </button>

        {/* LEFT: child showcase */}
        <aside className="relative hidden w-[42%] shrink-0 md:block">
          <Image
            src={child.image || '/mentors_kids.jpg'}
            alt={child.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-amber-500/20" />
          <div className="absolute inset-x-0 top-0 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
              Child Sponsorship
            </p>
            <h3 className="mt-2 text-4xl font-extrabold leading-tight text-white">
              Sponsor {child.name}
            </h3>
          </div>
          <div className="absolute inset-x-0 bottom-0 space-y-4 p-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-md">
              <Sparkles className="size-3.5" /> 1-to-1 Match
            </span>
            <p className="text-lg font-semibold text-white">
              {child.age} years old &middot; Dreams of becoming a {child.dream}
            </p>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-200">Selected plan</span>
                <span className="font-bold text-amber-300">
                  {formatSponsorshipAmount(selectedPlan.amount, selectedPlan.currency)} /{' '}
                  {frequency === 'MONTHLY' ? 'month' : 'year'}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-200">Coverage</span>
                <span className="font-semibold text-white">
                  {frequency === 'MONTHLY' ? '30 days' : '365 days'} per payment
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT: form column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile header */}
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-6 py-5 pr-16 text-white md:hidden">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-yellow-100">
              Child Sponsorship
            </p>
            <h3 className="text-2xl font-bold">Sponsor {child.name}</h3>
          </div>

          {/* Stepper */}
          <div className="border-b border-gray-100 px-6 py-4 sm:px-10">
            <ol className="flex items-center gap-1 sm:gap-2">
              {STEPS.map((s, i) => {
                const done = i < stepIndex
                const active = i === stepIndex
                return (
                  <li key={s.id} className="flex flex-1 items-center gap-1 sm:gap-2">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                        done
                          ? 'bg-emerald-500 text-white'
                          : active
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {done ? <CheckCircle2 className="size-4" /> : i + 1}
                    </span>
                    <span
                      className={`hidden text-xs font-semibold sm:block ${
                        active ? 'text-gray-900' : done ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span className={`mx-1 h-0.5 flex-1 rounded ${done ? 'bg-emerald-400' : 'bg-gray-100'}`} />
                    )}
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10 sm:py-8">
            {/* STEP 1: CHOOSE PLAN */}
            {step === 'plan' && (
              <div className="mx-auto max-w-3xl space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">
                    Choose Your Sponsorship Plan
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Each payment is a one-time charge covering {frequency === 'MONTHLY' ? '30 days' : 'a full year'} of support. Renew manually to keep the sponsorship active.
                  </p>
                </div>

                {/* Currency toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">Currency:</span>
                  {(['USD', 'RWF'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                        currency === c
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {c === 'USD' ? 'USD' : 'RWF'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(['MONTHLY', 'YEARLY'] as const).map((freq) => {
                    const plan = SPONSORSHIP_PLANS.find(
                      (p) => p.frequency === freq && p.currency === currency,
                    )!
                    const selected = frequency === freq
                    return (
                      <div
                        key={freq}
                        onClick={() => setFrequency(freq)}
                        className={`cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                          selected
                            ? 'border-yellow-500 bg-yellow-50/50 shadow-md ring-2 ring-yellow-400/30'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">{plan.label}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${freq === 'MONTHLY' ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {freq === 'MONTHLY' ? 'Popular' : 'Full Year'}
                          </span>
                        </div>
                        <div className="mb-1 text-3xl font-extrabold text-gray-900">
                          {formatSponsorshipAmount(plan.amount, plan.currency)}
                          <span className="text-sm font-normal text-gray-500">
                            {' '}/ {freq === 'MONTHLY' ? 'month' : 'year'}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-gray-600">
                          {freq === 'MONTHLY'
                            ? `One-time payment covering 30 days of support for ${child.name}.`
                            : `One-time payment covering 365 days of support for ${child.name}.`}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    Your sponsorship directly provides:
                  </h5>
                  <ul className="grid grid-cols-1 gap-2 text-xs text-gray-600 sm:grid-cols-2">
                    {[
                      'School tuition, uniform, stationery, and exam fees',
                      'Nutritious daily meals and clean drinking water',
                      'Community healthcare, medical checkups, and hygiene support',
                      'Direct letter updates and academic progress reports',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setStep('sponsor_info')}
                    className="bg-yellow-500 px-8 py-6 text-base font-bold text-white shadow-lg shadow-yellow-500/25 hover:bg-yellow-600 rounded-2xl flex items-center gap-2"
                  >
                    Continue to Sponsor Details
                    <ArrowRight className="size-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: SPONSOR INFORMATION */}
            {step === 'sponsor_info' && (
              <form onSubmit={handleProceedToReview} className="mx-auto max-w-3xl space-y-5">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">
                    Your Contact Information
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    We need these details for the payment receipt and sponsorship updates.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName" className="text-xs font-semibold text-gray-700">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={donor.firstName}
                      onChange={handleInputChange}
                      placeholder="Jane"
                      required
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-xs font-semibold text-gray-700">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={donor.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={donor.email}
                      onChange={handleInputChange}
                      placeholder="jane.doe@example.com"
                      required
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-xs font-semibold text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={donor.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="0788 123 456"
                      required
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="country" className="text-xs font-semibold text-gray-700">
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={donor.country}
                      onChange={handleInputChange}
                      placeholder="Rwanda, United States, etc."
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-xs font-semibold text-gray-700">
                      Address / City
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={donor.address}
                      onChange={handleInputChange}
                      placeholder="Kigali, Rwanda"
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep('plan')}
                    className="rounded-xl text-gray-600"
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-yellow-500 px-8 py-6 text-base font-bold text-white shadow-lg shadow-yellow-500/25 hover:bg-yellow-600 rounded-2xl flex items-center gap-2"
                  >
                    Review & Pay
                    <ArrowRight className="size-5" />
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 3: REVIEW + PAY */}
            {step === 'review' && (
              <div className="mx-auto max-w-3xl space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">
                    Review & Complete Payment
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    A secure IremboPay popup will open to complete your one-time sponsorship payment.
                  </p>
                </div>

                <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="size-4 text-yellow-600" />
                      Sponsored Child
                    </div>
                    <div className="font-bold text-gray-900">{child.name}</div>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="size-4 text-yellow-600" />
                      Plan
                    </div>
                    <div className="font-bold capitalize text-gray-900">
                      {frequency.toLowerCase()} ({formatSponsorshipAmount(selectedPlan.amount, selectedPlan.currency)})
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="size-4 text-yellow-600" />
                      Sponsor
                    </div>
                    <div className="text-right font-semibold text-gray-900">
                      {donor.firstName} {donor.lastName}
                      <div className="text-xs font-normal text-gray-500">{donor.email}</div>
                      {donor.phoneNumber.trim() && (
                        <div className="text-xs font-normal text-gray-500">{donor.phoneNumber}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-base font-bold text-gray-900">
                      Due now ({frequency === 'MONTHLY' ? '30 days coverage' : '365 days coverage'})
                    </div>
                    <div className="text-2xl font-extrabold text-yellow-600">
                      {formatSponsorshipAmount(selectedPlan.amount, selectedPlan.currency)}
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-xs leading-relaxed text-gray-600">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedPolicy}
                    onChange={(e) => setAcceptedPolicy(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-yellow-500"
                  />
                  <span>
                    I have read and accept the{' '}
                    <a
                      href="/refund-cancellation-policy"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-yellow-700 underline underline-offset-2 hover:text-yellow-800"
                    >
                      Refund &amp; Cancellation Policy
                    </a>
                    .
                  </span>
                </label>

                {(paymentState === 'confirmation_pending' || paymentState === 'widget_opened') && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <Loader2 className="size-4 shrink-0 animate-spin text-amber-600" />
                    <span>
                      {paymentState === 'widget_opened'
                        ? 'Complete your payment in the IremboPay popup...'
                        : 'Payment submitted. Awaiting server confirmation...'}
                    </span>
                  </div>
                )}

                {paymentState === 'failed' && (
                  <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="size-4 shrink-0 text-rose-600" />
                      <span>Payment could not be completed.</span>
                    </div>
                    {invoiceNumber && (
                      <button type="button" onClick={handleReopenWidget} className="ml-2 font-semibold underline">
                        Retry
                      </button>
                    )}
                  </div>
                )}

                {paymentState === 'cancelled' && (
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100 p-3 text-xs text-slate-700">
                    <span>Payment was cancelled.</span>
                    {invoiceNumber && (
                      <button type="button" onClick={handleReopenWidget} className="font-semibold text-yellow-700 underline">
                        Re-open Payment
                      </button>
                    )}
                  </div>
                )}

                {paymentLinkBackup && paymentState !== 'idle' && paymentState !== 'preparing' && (
                  <p className="text-center text-xs text-gray-500">
                    Having trouble with the popup?{' '}
                    <a href={paymentLinkBackup} target="_blank" rel="noreferrer" className="font-semibold text-yellow-700 underline">
                      Open payment link in a new tab
                    </a>
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep('sponsor_info')}
                    className="rounded-xl text-gray-600"
                    disabled={paymentState === 'preparing' || paymentState === 'confirmation_pending'}
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePay}
                    disabled={paymentState === 'preparing' || paymentState === 'confirmation_pending' || paymentState === 'widget_opened'}
                    className="bg-yellow-500 px-8 py-6 text-base font-bold text-white shadow-lg shadow-yellow-500/25 hover:bg-yellow-600 rounded-2xl flex items-center gap-2"
                  >
                    {paymentState === 'preparing' ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Preparing payment...
                      </>
                    ) : (
                      <>
                        <LockKeyhole className="size-5" />
                        Pay {formatSponsorshipAmount(selectedPlan.amount, selectedPlan.currency)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMED */}
            {step === 'done' && (
              <div className="mx-auto max-w-3xl space-y-6 text-center">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg">
                  <CheckCircle2 className="size-10" />
                </div>

                <div>
                  <span className="mb-2 inline-block rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                    Sponsorship Active
                  </span>
                  <h4 className="text-3xl font-extrabold text-gray-900">
                    Thank You for Sponsoring {child.name}!
                  </h4>
                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                    Your one-time payment of{' '}
                    <strong>{formatSponsorshipAmount(selectedPlan.amount, selectedPlan.currency)}</strong>{' '}
                    is confirmed. {child.name} is now sponsored
                    {coverageEnd ? ` through ${coverageEnd}` : ''}. Renew to keep the sponsorship active.
                  </p>
                </div>

                <div className="mx-auto max-w-lg space-y-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 text-left">
                  <div className="text-center font-mono text-sm font-bold text-gray-900">
                    Invoice: {invoiceNumber} | Ref: {paymentReference}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Sponsored Child:</span>
                    <span className="font-bold text-gray-900">{child.name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Plan:</span>
                    <span className="font-semibold capitalize text-gray-900">
                      {selectedPlan.frequency.toLowerCase()} ({formatSponsorshipAmount(selectedPlan.amount, selectedPlan.currency)})
                    </span>
                  </div>
                  {coverageEnd && (
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Active until:</span>
                      <span className="font-semibold text-gray-900">{coverageEnd}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleModalClose}
                    className="w-full bg-yellow-500 py-6 text-base font-bold text-white shadow-lg shadow-yellow-500/25 hover:bg-yellow-600 rounded-2xl"
                  >
                    Done & View Children
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
