function getCsrfToken(): string {
  const existing = document.cookie
    .split(';')
    .find((c) => c.trim().startsWith('mdk_csrf='))
    ?.split('=')[1]

  if (existing) return existing

  const token = crypto.randomUUID()
  document.cookie = `mdk_csrf=${token}; path=/; SameSite=Lax`
  return token
}

export async function postMdk<T>(
  handler: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const res = await fetch('/api/mdk', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-moneydevkit-csrf-token': getCsrfToken(),
    },
    body: JSON.stringify({ handler, ...payload }),
  })

  if (!res.ok) throw new Error(`MDK request failed: ${res.status}`)
  return (await res.json()) as T
}
