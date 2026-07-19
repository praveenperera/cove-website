import { NextResponse } from 'next/server'

import { isAllowedCorsOrigin } from '@/lib/cors-origin'

const productionSiteOrigin = 'https://covebitcoinwallet.com'

function configuredSiteOrigins(): ReadonlySet<string> {
  const configured = process.env.COVE_SITE_ORIGIN ?? productionSiteOrigin
  const origins = configured
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (process.env.NODE_ENV !== 'production')
    origins.push('http://localhost:4321')
  return new Set(origins)
}

function allowedOrigin(request: Request): string | null {
  const origin = request.headers.get('origin')
  if (!origin) return null

  const requestOrigin = new URL(request.url).origin
  if (isAllowedCorsOrigin(origin, requestOrigin, configuredSiteOrigins())) {
    return origin
  }

  return null
}

function addCorsHeaders(
  request: Request,
  response: NextResponse,
  methods: readonly string[],
): NextResponse {
  const origin = allowedOrigin(request)
  if (origin) response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.append('Vary', 'Origin')
  response.headers.set('Access-Control-Allow-Methods', methods.join(', '))
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  response.headers.set('Access-Control-Max-Age', '86400')
  return response
}

export function corsJson(
  request: Request,
  methods: readonly string[],
  body: unknown,
  init?: ResponseInit,
): NextResponse {
  return addCorsHeaders(request, NextResponse.json(body, init), methods)
}

export function rejectDisallowedBrowserOrigin(
  request: Request,
  methods: readonly string[],
): NextResponse | null {
  if (!request.headers.has('origin') || allowedOrigin(request)) return null
  return corsJson(
    request,
    methods,
    { error: 'Origin is not allowed' },
    { status: 403 },
  )
}

export function corsOptions(
  request: Request,
  methods: readonly string[],
): NextResponse {
  const rejection = rejectDisallowedBrowserOrigin(request, methods)
  if (rejection) return rejection
  return addCorsHeaders(
    request,
    new NextResponse(null, { status: 204 }),
    methods,
  )
}
