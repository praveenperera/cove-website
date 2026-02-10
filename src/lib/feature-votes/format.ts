export function formatSats(sats: number) {
  return new Intl.NumberFormat('en-US').format(sats)
}

export function displayName(name: string) {
  return name.trim().replace(/^Feature:\s*/i, '')
}
