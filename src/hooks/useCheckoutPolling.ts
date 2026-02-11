import { useEffect, useRef } from 'react'

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

export function useCheckoutPolling({
  checkoutId,
  active,
  onPaid,
  onExpired,
}: UseCheckoutPollingOptions) {
  const onPaidRef = useRef(onPaid)
  const onExpiredRef = useRef(onExpired)

  useEffect(() => { onPaidRef.current = onPaid }, [onPaid])
  useEffect(() => { onExpiredRef.current = onExpired }, [onExpired])

  useEffect(() => {
    if (!active || !checkoutId) return

    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      try {
        const { data } = await postMdk<MdkCheckoutStatus>('get_checkout', {
          checkoutId,
        })

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
          } catch {
            // onPaid failed (e.g. confirm endpoint), retry on next poll
            if (!cancelled) setTimeout(poll, 750)
          }
          return
        }
      } catch {
        // ignore polling errors
      }

      if (!cancelled) setTimeout(poll, 750)
    }

    poll()

    return () => { cancelled = true }
  }, [active, checkoutId])
}
