import { NextRequest, NextResponse } from 'next/server'
import { storeUrlForUserAgent } from '@/lib/store-redirect'

export function GET(request: NextRequest) {
  const storeUrl = storeUrlForUserAgent(request.headers.get('user-agent'))

  if (storeUrl) {
    return NextResponse.redirect(storeUrl)
  }

  return NextResponse.redirect(new URL('/', request.url))
}
