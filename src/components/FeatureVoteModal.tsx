'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const SAT_PRESETS = [1000, 5000, 10000, 25000, 100000]

type CheckoutData = {
  id: string
  invoice: string
  amountSats: number
  fiatAmount: number | null
  expiresAt: string
}

type Feature = {
  productId: string
  name: string
  description: string | null
}

type Step = 'pick' | 'loading' | 'invoice' | 'paid' | 'expired'

function formatSats(sats: number) {
  return new Intl.NumberFormat('en-US').format(sats)
}

function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}

async function postMdk<T>(
  handler: string,
  payload: Record<string, unknown>,
): Promise<T> {
  let token = document.cookie
    .split(';')
    .find((c) => c.trim().startsWith('mdk_csrf='))
    ?.split('=')[1]

  if (!token) {
    token = crypto.randomUUID()
    document.cookie = `mdk_csrf=${token}; path=/; SameSite=Lax`
  }

  const res = await fetch('/api/mdk', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-moneydevkit-csrf-token': token,
    },
    body: JSON.stringify({ handler, ...payload }),
  })

  if (!res.ok) throw new Error(`MDK request failed: ${res.status}`)
  return (await res.json()) as T
}

export function FeatureVoteModal({
  open,
  onClose,
  feature,
  onVoteRecorded,
}: {
  open: boolean
  onClose: () => void
  feature: Feature | null
  onVoteRecorded: () => void
}) {
  const [step, setStep] = useState<Step>('pick')
  const [selectedAmount, setSelectedAmount] = useState(SAT_PRESETS[0])
  const [customAmount, setCustomAmount] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [checkout, setCheckout] = useState<CheckoutData | null>(null)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState('')

  const confirmingRef = useRef(false)

  const amount = useMemo(() => {
    if (!useCustom) return selectedAmount
    return Math.round(parseFloat(customAmount || '0'))
  }, [customAmount, selectedAmount, useCustom])

  useEffect(() => {
    if (!open) return
    setStep('pick')
    setSelectedAmount(SAT_PRESETS[0])
    setCustomAmount('')
    setUseCustom(false)
    setCheckout(null)
    setCopySuccess(false)
    setError('')
    confirmingRef.current = false
  }, [open, feature?.productId])

  useEffect(() => {
    if (step !== 'invoice' || !checkout || !feature) return

    const interval = setInterval(async () => {
      try {
        const { data } = await postMdk<{
          data: {
            status: string
            invoice?: {
              amountSatsReceived?: number | null
            } | null
          }
        }>('get_checkout', {
          checkoutId: checkout.id,
        })

        if (data.status === 'EXPIRED') {
          setStep('expired')
          return
        }

        const paymentReceived =
          data.status === 'PAYMENT_RECEIVED' ||
          data.status === 'CONFIRMED' ||
          (data.invoice?.amountSatsReceived ?? 0) > 0

        if (!paymentReceived || confirmingRef.current) return

        confirmingRef.current = true

        const confirmRes = await fetch('/api/feature-votes/confirm', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ checkoutId: checkout.id }),
        })

        const confirmJson = (await confirmRes
          .json()
          .catch(() => ({}))) as { error?: string }

        if (!confirmRes.ok) {
          throw new Error(confirmJson?.error || 'Failed to record vote')
        }

        setStep('paid')
        onVoteRecorded()
      } catch (pollError) {
        console.error('feature vote polling error:', pollError)
        confirmingRef.current = false
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [checkout, feature, onVoteRecorded, step])

  useEffect(() => {
    if (step !== 'invoice' || !checkout) return

    const update = () => {
      const diff =
        new Date(checkout.expiresAt).getTime() - new Date().getTime()

      if (diff <= 0) {
        setTimeRemaining('Expired')
        setStep('expired')
        return
      }

      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeRemaining(`${m}:${s.toString().padStart(2, '0')}`)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [checkout, step])

  const copyInvoice = useCallback(async () => {
    if (!checkout?.invoice) return

    try {
      await navigator.clipboard.writeText(checkout.invoice)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (copyError) {
      console.error('Failed to copy invoice:', copyError)
    }
  }, [checkout])

  const handleSubmit = async () => {
    if (!feature || amount < 1) return

    setStep('loading')
    setError('')

    try {
      const res = await fetch('/api/feature-votes/create-checkout', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          productId: feature.productId,
          amountSats: amount,
        }),
      })

      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        data?: {
          checkoutId: string
          invoice: string
          amountSats?: number
          fiatAmount: number | null
          expiresAt: string
        }
      }

      if (!res.ok) {
        throw new Error(json?.error || 'Failed to create invoice')
      }

      if (!json.data) {
        throw new Error('Missing checkout data in API response')
      }

      setCheckout({
        id: json.data.checkoutId,
        invoice: json.data.invoice,
        amountSats: json.data.amountSats ?? amount,
        fiatAmount: json.data.fiatAmount,
        expiresAt: json.data.expiresAt,
      })
      setStep('invoice')
    } catch (submitError) {
      console.error('feature vote checkout failed:', submitError)
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to create invoice',
      )
      setStep('pick')
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep('pick')
      setCheckout(null)
      setCopySuccess(false)
      setError('')
      setCustomAmount('')
      setUseCustom(false)
      confirmingRef.current = false
    }, 200)
  }

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 pt-5 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {feature ? `Vote: ${feature.name}` : 'Vote'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="px-6 pb-6 pt-4">
            {step === 'pick' && (
              <>
                <p className="mb-4 text-sm text-gray-500">
                  Choose how many sats you want to vote with.
                </p>

                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SAT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setSelectedAmount(preset)
                        setUseCustom(false)
                      }}
                      className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${
                        !useCustom && selectedAmount === preset
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formatSats(preset)} sats
                    </button>
                  ))}
                  <button
                    onClick={() => setUseCustom(true)}
                    className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${
                      useCustom
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {useCustom && (
                  <div className="mb-4">
                    <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2.5">
                      <span className="mr-1 text-sm text-gray-400">₿</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Sats (e.g. 10000)"
                        value={customAmount}
                        autoFocus
                        onChange={(event) => setCustomAmount(event.target.value)}
                        className="flex-1 border-none bg-transparent text-sm text-gray-900 shadow-none outline-none ring-0 placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-0"
                      />
                      <span className="ml-1 text-sm text-gray-400">sats</span>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="mb-3 text-center text-sm text-red-600">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={amount < 1 || !feature}
                  className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-40"
                >
                  Continue {formatSats(amount)} sats
                </button>
              </>
            )}

            {step === 'loading' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
                <p className="mt-4 text-sm text-gray-500">Generating invoice...</p>
              </div>
            )}

            {step === 'invoice' && checkout && (
              <div className="flex flex-col items-center">
                <div className="mb-3 text-center">
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatSats(checkout.amountSats)} sats
                  </p>
                  {typeof checkout.fiatAmount === 'number' && (
                    <p className="mt-0.5 text-sm text-gray-400">
                      {formatUsd(checkout.fiatAmount)} USD
                    </p>
                  )}
                </div>

                <div
                  className="cursor-pointer rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                  onClick={copyInvoice}
                  title="Click to copy invoice"
                >
                  <QRCodeSVG
                    value={checkout.invoice}
                    size={240}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="Q"
                  />
                </div>

                <button
                  onClick={copyInvoice}
                  className="mt-3 flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-200"
                >
                  {copySuccess ? 'Copied!' : 'Copy invoice'}
                </button>

                <p className="mt-3 text-xs text-gray-400">Expires in {timeRemaining}</p>
              </div>
            )}

            {step === 'paid' && (
              <div className="flex flex-col items-center py-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-900">Vote recorded!</p>
                <p className="mt-1 text-sm text-gray-500">
                  Thanks for supporting this feature.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Done
                </button>
              </div>
            )}

            {step === 'expired' && (
              <div className="flex flex-col items-center py-8">
                <p className="mb-4 text-sm text-gray-500">
                  Invoice expired. Try again?
                </p>
                <button
                  onClick={() => setStep('pick')}
                  className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Start over
                </button>
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
