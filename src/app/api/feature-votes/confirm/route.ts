import {
  corsJson,
  corsOptions,
  rejectDisallowedBrowserOrigin,
} from '@/lib/cors'

import {
  callMdk,
  FeatureVoteRecordError,
  recordPaidFeatureVoteCheckout,
  type MdkCheckout,
} from '@/lib/feature-votes/server'

type ConfirmBody = {
  checkoutId?: unknown
}

const methods = ['POST', 'OPTIONS'] as const

export function OPTIONS(request: Request) {
  return corsOptions(request, methods)
}

export async function POST(request: Request) {
  const rejection = rejectDisallowedBrowserOrigin(request, methods)
  if (rejection) return rejection

  let body: ConfirmBody

  try {
    body = await request.json()
  } catch {
    return corsJson(
      request,
      methods,
      { error: 'Invalid JSON body' },
      { status: 400 },
    )
  }

  const checkoutId =
    typeof body.checkoutId === 'string' ? body.checkoutId.trim() : ''

  if (!checkoutId) {
    return corsJson(
      request,
      methods,
      { error: 'checkoutId is required' },
      { status: 400 },
    )
  }

  try {
    const checkoutResponse = await callMdk<{ data?: MdkCheckout }>({
      handler: 'get_checkout',
      checkoutId,
    })

    const checkout = checkoutResponse.data

    if (!checkout) {
      return corsJson(
        request,
        methods,
        { error: 'Checkout not found' },
        { status: 404 },
      )
    }

    try {
      const recorded = await recordPaidFeatureVoteCheckout(checkout)

      return corsJson(request, methods, {
        accepted: true,
        ...recorded,
      })
    } catch (error) {
      if (error instanceof FeatureVoteRecordError && error.code === 'unpaid') {
        return corsJson(request, methods, {
          accepted: false,
          status: error.status,
        })
      }

      if (error instanceof FeatureVoteRecordError) {
        return corsJson(
          request,
          methods,
          { error: error.message },
          { status: 400 },
        )
      }

      throw error
    }
  } catch (error) {
    console.error('feature vote confirm failed:', error)
    return corsJson(
      request,
      methods,
      {
        error: 'Failed to confirm feature vote',
      },
      { status: 500 },
    )
  }
}
