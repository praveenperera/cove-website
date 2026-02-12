import { useEffect, useRef, useSyncExternalStore } from 'react'

import { postMdk } from '@/lib/mdk-client'

type MdkCheckoutStatus = {
  data: {
    status: string
    invoice?: { amountSatsReceived?: number | null } | null
  }
}

type UseCheckoutPollingOptions = {
  checkoutId: string | null
  active: boolean
  onPaid: () => void | Promise<void>
  onExpired: () => void
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
  onPaid,
  onExpired,
}: UseCheckoutPollingOptions) {
  const onPaidRef = useRef(onPaid)
  const onExpiredRef = useRef(onExpired)

  useEffect(() => {
    onPaidRef.current = onPaid
  }, [onPaid])
  useEffect(() => {
    onExpiredRef.current = onExpired
  }, [onExpired])

  const visible = useSyncExternalStore(
    subscribeToVisibility,
    getVisibility,
    getServerVisibility,
  )

  const enabled = active && visible && !!checkoutId

  useEffect(() => {
    if (!enabled || !checkoutId) return

    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      try {
        const { data } = await postMdk<MdkCheckoutStatus>('get_checkout', {
          checkoutId,
        })

        if (cancelled) return

        if (data.status === 'EXPIRED') {
          onExpiredRef.current()
          return
        }

        const paid =
          data.status === 'PAYMENT_RECEIVED' ||
          data.status === 'CONFIRMED' ||
          (data.invoice?.amountSatsReceived ?? 0) > 0

        if (paid) {
          try {
            await onPaidRef.current()
          } catch (error) {
            console.error('Error in onPaid callback:', error)
          }
          return
        }
      } catch {
        // ignore polling errors
      }

      if (!cancelled) setTimeout(poll, 500)
    }

    poll()

    return () => {
      cancelled = true
    }
  }, [enabled, checkoutId])
}
