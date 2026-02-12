import { useEffect } from 'react'

import { confirmCheckout } from '@/lib/feature-votes/confirm-checkout'
import { getPendingCheckouts } from '@/lib/feature-votes/pending-checkouts'

export function usePendingCheckoutRecovery(onRecovered?: () => void) {
  useEffect(() => {
    const pending = getPendingCheckouts()
    if (pending.length === 0) return

    console.log(`recovering ${pending.length} pending checkout(s)`)

    const promises = pending.map(({ checkoutId }) =>
      confirmCheckout(checkoutId),
    )

    Promise.allSettled(promises).then((results) => {
      const recovered = results.filter(
        (r) => r.status === 'fulfilled' && r.value,
      ).length

      if (recovered > 0) {
        console.log(`recovered ${recovered} vote(s)`)
        onRecovered?.()
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
