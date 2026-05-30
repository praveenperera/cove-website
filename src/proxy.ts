import { NextResponse, type NextRequest } from 'next/server'

const apexHost = 'covebitcoinwallet.com'
const hstsHeader = 'max-age=63072000; includeSubDomains; preload'

export function proxy(request: NextRequest) {
  if (request.nextUrl.hostname !== `www.${apexHost}`) {
    return NextResponse.next()
  }

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.hostname = apexHost

  const response = NextResponse.redirect(redirectUrl, 308)
  response.headers.set('Strict-Transport-Security', hstsHeader)

  return response
}
