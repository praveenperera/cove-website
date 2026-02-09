import { NextRequest, NextResponse } from 'next/server'

const APP_STORE_URL =
  'https://apps.apple.com/app/cove-simple-bitcoin-wallet/id6642680364'
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=org.bitcoinppl.cove'

export function GET(request: NextRequest) {
  const ua = request.headers.get('user-agent')?.toLowerCase() ?? ''

  if (/android/.test(ua)) {
    return NextResponse.redirect(PLAY_STORE_URL)
  }

  if (/iphone|ipad|ipod|mac/.test(ua)) {
    return NextResponse.redirect(APP_STORE_URL)
  }

  // fallback to homepage where both links are shown
  return NextResponse.redirect(new URL('/', request.url))
}
