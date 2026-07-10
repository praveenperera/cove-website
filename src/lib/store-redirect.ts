export const APP_STORE_URL =
  'https://apps.apple.com/app/cove-simple-bitcoin-wallet/id6642680364'

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=org.bitcoinppl.cove'

export function storeUrlForUserAgent(userAgent: string | null) {
  const normalizedUserAgent = userAgent?.toLowerCase() ?? ''

  if (/android/.test(normalizedUserAgent)) {
    return PLAY_STORE_URL
  }

  if (/iphone|ipad|ipod/.test(normalizedUserAgent)) {
    return APP_STORE_URL
  }

  return null
}
