import { useEffect, useRef, useSyncExternalStore } from 'react'

import { paymentApiUrl, readJson } from '@/lib/payments-client'

type MdkCheckoutStatus = {
  status: string
}

type UseCheckoutPollingOptions = {
  checkoutId: string | null
  active: boolean
  apiOrigin?: string
  onPaid: () => void | Promise<void>
  onExpired: () => void
  onError?: (message: string) => void
}

function subscribeToVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}

function getVisibility() {
  return document.visibilityState === 'visible'
}

function getServerVisibility() {
  return true
}

export function useCheckoutPolling({
  checkoutId,
  active,
  apiOrigin = '',
  onPaid,
  onExpired,
  onError,
}: UseCheckoutPollingOptions) {
  const onPaidRef = useRef(onPaid)
  const onExpiredRef = useRef(onExpired)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onPaidRef.current = onPaid
  }, [onPaid])
  useEffect(() => {
    onExpiredRef.current = onExpired
  }, [onExpired])
  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const visible = useSyncExternalStore(
    subscribeToVisibility,
    getVisibility,
    getServerVisibility,
  )

  const enabled = active && visible && !!checkoutId

  useEffect(() => {
    if (!enabled || !checkoutId) return

    let cancelled = false
    let timeout: ReturnType<typeof setTimeout> | undefined
    let failedAttempts = 0

    const poll = async () => {
      if (cancelled) return
      try {
        const response = await fetch(
          paymentApiUrl(
            apiOrigin,
            `/api/checkouts/${encodeURIComponent(checkoutId)}/status`,
          ),
          { cache: 'no-store' },
        )
        const data = await readJson<MdkCheckoutStatus>(response)

        if (cancelled) return
        failedAttempts = 0

        if (data.status === 'EXPIRED' || data.status === 'CANCELLED') {
          onExpiredRef.current()
          return
        }

        if (data.status === 'PAYMENT_RECEIVED') {
          try {
            await onPaidRef.current()
          } catch (error) {
            console.error('Error in onPaid callback:', error)
          }
          return
        }
      } catch (error) {
        failedAttempts += 1
        if (failedAttempts === 3) {
          onErrorRef.current?.(
            error instanceof Error
              ? error.message
              : 'Unable to check payment status',
          )
        }
      }

      if (!cancelled) {
        const delay = Math.min(1000 * 2 ** failedAttempts, 10_000)
        timeout = setTimeout(poll, delay)
      }
    }

    poll()

    return () => {
      cancelled = true
      if (timeout) clearTimeout(timeout)
    }
  }, [apiOrigin, checkoutId, enabled])
}
