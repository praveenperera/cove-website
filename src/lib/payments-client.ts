export function paymentApiUrl(apiOrigin: string, path: string): string {
  const browserOrigin =
    typeof window !== 'undefined' &&
    window.location.origin === 'https://covebitcoinwallet.com'
      ? 'https://roadmap.covebitcoinwallet.com'
      : ''
  const normalizedOrigin = (apiOrigin || browserOrigin).replace(/\/$/, '')
  return `${normalizedOrigin}${path}`
}

export async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as T | null

  if (!response.ok) {
    const error = body as { error?: unknown } | null
    const message =
      typeof error?.error === 'string'
        ? error.error
        : `Payment request failed (${response.status})`
    throw new Error(message)
  }

  if (body === null) throw new Error('Payment API returned an empty response')
  return body
}
