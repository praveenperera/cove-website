import { removePendingCheckout } from './pending-checkouts'

const inflight = new Map<string, Promise<boolean>>()

const MAX_ATTEMPTS = 10
const INITIAL_DELAY_MS = 500
const MAX_DELAY_MS = 10_000

async function attemptConfirm(checkoutId: string): Promise<boolean> {
  let delay = INITIAL_DELAY_MS

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch('/api/feature-votes/confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ checkoutId }),
      })

      // permanent errors, stop retrying
      if (res.status === 404 || res.status === 400) {
        removePendingCheckout(checkoutId)
        return false
      }

      if (res.ok) {
        const json = (await res.json().catch(() => ({}))) as {
          accepted?: boolean
        }

        if (json.accepted) {
          removePendingCheckout(checkoutId)
          return true
        }
      }
    } catch {
      // network error, will retry
    }

    if (attempt < MAX_ATTEMPTS - 1) {
      await new Promise((r) => setTimeout(r, delay))
      delay = Math.min(delay * 2, MAX_DELAY_MS)
    }
  }

  return false
}

export function confirmCheckout(checkoutId: string): Promise<boolean> {
  const existing = inflight.get(checkoutId)
  if (existing) return existing

  const promise = attemptConfirm(checkoutId).finally(() => {
    inflight.delete(checkoutId)
  })

  inflight.set(checkoutId, promise)
  return promise
}
