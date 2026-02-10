'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { QRCodeSVG } from 'qrcode.react'
import { useState, useEffect, useCallback } from 'react'

const USD_PRESETS = [100, 500, 1000, 2500, 5000]
const SAT_PRESETS = [1000, 5000, 10000, 25000, 100000]

type Currency = 'USD' | 'SAT'

function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}

function formatSats(sats: number) {
  return new Intl.NumberFormat('en-US').format(sats)
}

function formatPreset(amount: number, currency: Currency) {
  if (currency === 'SAT') return `${formatSats(amount)} sats`
  return formatUsd(amount)
}

function formatAmount(amount: number, currency: Currency) {
  if (currency === 'SAT') return `${formatSats(amount)} sats`
  return formatUsd(amount)
}

type CheckoutData = {
  id: string
  invoice: string
  amountSats: number
  fiatAmount: number
  currency: string
  expiresAt: string
}

type MdkResponse<T> = { data: T }

type MdkCheckoutStatus = {
  status: string
  invoice?: { amountSatsReceived?: number | null } | null
}

type MdkCreatedCheckout = {
  id: string
  currency: string
  invoiceAmountSats: number | null
  invoice: {
    invoice: string
    amountSats: number | null
    fiatAmount: number
    expiresAt: string
  }
}

type Step = 'pick' | 'loading' | 'invoice' | 'paid' | 'expired'

async function postMdk<T>(
  handler: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const res = await fetch('/api/mdk', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ handler, ...payload }),
  })

  if (!res.ok) throw new Error(`MDK request failed: ${res.status}`)
  return (await res.json()) as T
}

export function DonateModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [step, setStep] = useState<Step>('pick')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [selectedAmount, setSelectedAmount] = useState(USD_PRESETS[0])
  const [customAmount, setCustomAmount] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [checkout, setCheckout] = useState<CheckoutData | null>(null)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState('')

  const presets = currency === 'USD' ? USD_PRESETS : SAT_PRESETS

  const amount = useCustom
    ? currency === 'USD'
      ? Math.round((parseFloat(customAmount) || 0) * 100)
      : Math.round(parseFloat(customAmount) || 0)
    : selectedAmount

  const minAmount = currency === 'USD' ? 100 : 1

  // poll for payment
  useEffect(() => {
    if (step !== 'invoice' || !checkout) return

    const interval = setInterval(async () => {
      try {
        const { data } = await postMdk<MdkResponse<MdkCheckoutStatus>>(
          'get_checkout',
          { checkoutId: checkout.id },
        )

        if (
          data.status === 'PAYMENT_RECEIVED' ||
          (data.invoice?.amountSatsReceived ?? 0) > 0
        ) {
          setStep('paid')
        } else if (data.status === 'EXPIRED') {
          setStep('expired')
        }
      } catch {
        // ignore polling errors
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [step, checkout])

  // countdown timer
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
  }, [step, checkout])

  const handleSubmit = async () => {
    if (amount < minAmount) return
    setStep('loading')

    try {
      const { data } = await postMdk<MdkResponse<MdkCreatedCheckout>>(
        'create_checkout',
        {
          params: {
            type: 'AMOUNT',
            title: 'Donate to Cove',
            description: 'Support the development of Cove bitcoin wallet',
            amount,
            currency,
            successUrl: '/checkout/success',
          },
        },
      )

      setCheckout({
        id: data.id,
        invoice: data.invoice.invoice,
        amountSats: data.invoice.amountSats ?? data.invoiceAmountSats ?? 0,
        fiatAmount: data.invoice.fiatAmount,
        currency: data.currency,
        expiresAt: data.invoice.expiresAt,
      })
      setStep('invoice')
    } catch (err) {
      console.error('create_checkout failed:', err)
      setError('Failed to create invoice. Please try again.')
      setStep('pick')
    }
  }

  const copyInvoice = useCallback(async () => {
    if (!checkout?.invoice) return
    try {
      await navigator.clipboard.writeText(checkout.invoice)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy invoice:', err)
    }
  }, [checkout])

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep('pick')
      setCheckout(null)
      setCopySuccess(false)
      setError('')
      setCustomAmount('')
      setUseCustom(false)
    }, 200)
  }

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 pt-5 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Donate to Cove
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
            {/* step 1: pick amount */}
            {step === 'pick' && (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Support the development of Cove bitcoin wallet
                </p>

                {/* currency toggle */}
                <div className="mb-4 flex rounded-lg bg-gray-100 p-0.5">
                  {(['USD', 'SAT'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c)
                        setSelectedAmount(
                          c === 'USD' ? USD_PRESETS[0] : SAT_PRESETS[0],
                        )
                        setCustomAmount('')
                      }}
                      className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                        currency === c
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {c === 'USD' ? 'USD' : 'Sats'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-3">
                  {presets.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setSelectedAmount(p)
                        setUseCustom(false)
                      }}
                      className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${
                        !useCustom && selectedAmount === p
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formatPreset(p, currency)}
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
                      <span className="text-sm text-gray-400 mr-1">
                        {currency === 'USD' ? '$' : '₿'}
                      </span>
                      <input
                        type="number"
                        min={currency === 'USD' ? '0.01' : '1'}
                        step={currency === 'USD' ? '0.01' : '1'}
                        placeholder={
                          currency === 'USD'
                            ? 'Amount (e.g. 3.50)'
                            : 'Sats (e.g. 10000)'
                        }
                        value={customAmount}
                        autoFocus
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="flex-1 border-none bg-transparent text-sm text-gray-900 shadow-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0 placeholder:text-gray-400"
                      />
                      {currency === 'SAT' && (
                        <span className="text-sm text-gray-400 ml-1">sats</span>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <p className="mb-3 text-center text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  onClick={() => {
                    setError('')
                    handleSubmit()
                  }}
                  disabled={amount < minAmount}
                  className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-40"
                >
                  Continue {formatAmount(amount, currency)}
                </button>
              </>
            )}

            {/* step 2: loading */}
            {step === 'loading' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
                <p className="mt-4 text-sm text-gray-500">
                  Generating invoice...
                </p>
              </div>
            )}

            {/* step 3: invoice / QR code */}
            {step === 'invoice' && checkout && (
              <div className="flex flex-col items-center">
                <div className="mb-3 text-center">
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatSats(checkout.amountSats)} sats
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {formatUsd(checkout.fiatAmount)} USD
                  </p>
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
                  {copySuccess ? (
                    <>
                      <svg
                        className="h-3.5 w-3.5 text-green-500"
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
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy invoice
                    </>
                  )}
                </button>

                <p className="mt-3 text-xs text-gray-400">
                  Expires in {timeRemaining}
                </p>
              </div>
            )}

            {/* step 4: paid */}
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
                <p className="text-lg font-semibold text-gray-900">
                  Thank you!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Your donation has been received
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Done
                </button>
              </div>
            )}

            {/* step 5: expired */}
            {step === 'expired' && (
              <div className="flex flex-col items-center py-8">
                <p className="text-sm text-gray-500 mb-4">
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
