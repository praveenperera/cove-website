'use client'

import { useCheckoutSuccess } from '@moneydevkit/nextjs'
import Link from 'next/link'

export default function SuccessPage() {
  const { isCheckoutPaidLoading, isCheckoutPaid } = useCheckoutSuccess()

  if (isCheckoutPaidLoading || isCheckoutPaid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Verifying payment...</p>
      </div>
    )
  }

  if (!isCheckoutPaid) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Payment has not been confirmed.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-2xl font-semibold text-gray-900">
        Thank you for your donation!
      </p>
      <Link
        href="/"
        className="text-midnight-blue-600 underline hover:text-midnight-blue-700"
      >
        Back to home
      </Link>
    </div>
  )
}
