import { NextResponse, type NextRequest } from 'next/server'
import { storeUrlForUserAgent } from './lib/store-redirect'

const apexHost = 'covebitcoinwallet.com'
const hstsHeader = 'max-age=63072000; includeSubDomains; preload'

export function proxy(request: NextRequest) {
  if (request.nextUrl.hostname === `www.${apexHost}`) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.hostname = apexHost

    const response = NextResponse.redirect(redirectUrl, 308)
    response.headers.set('Strict-Transport-Security', hstsHeader)

    return response
  }

  if (request.nextUrl.pathname === '/') {
    const storeUrl = storeUrlForUserAgent(request.headers.get('user-agent'))

    if (storeUrl) {
      const response = NextResponse.redirect(storeUrl)
      response.headers.set('Cache-Control', 'private, no-store')
      response.headers.set('Vary', 'User-Agent')

      return response
    }
  }

  return NextResponse.next()
}
