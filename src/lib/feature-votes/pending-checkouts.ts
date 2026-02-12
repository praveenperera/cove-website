const STORAGE_KEY = 'cove_pending_checkouts'
const TTL_MS = 24 * 60 * 60 * 1000

type PendingCheckout = {
  checkoutId: string
  productId: string
  createdAt: number
}

export function getPendingCheckouts(): PendingCheckout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const items: PendingCheckout[] = JSON.parse(raw)
    const now = Date.now()
    const valid = items.filter((item) => now - item.createdAt < TTL_MS)

    // clean up expired entries
    if (valid.length !== items.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid))
    }

    return valid
  } catch {
    return []
  }
}

export function addPendingCheckout(
  checkout: Omit<PendingCheckout, 'createdAt'>,
) {
  try {
    const current = getPendingCheckouts()
    const exists = current.some((c) => c.checkoutId === checkout.checkoutId)
    if (exists) return

    current.push({ ...checkout, createdAt: Date.now() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // localStorage unavailable
  }
}

export function removePendingCheckout(checkoutId: string) {
  try {
    const current = getPendingCheckouts()
    const filtered = current.filter((c) => c.checkoutId !== checkoutId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    // localStorage unavailable
  }
}
