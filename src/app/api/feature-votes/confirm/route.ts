import { NextResponse } from 'next/server'

import {
  callMdk,
  FeatureVoteRecordError,
  recordPaidFeatureVoteCheckout,
  type MdkCheckout,
} from '@/lib/feature-votes/server'

type ConfirmBody = {
  checkoutId?: unknown
}

export async function POST(request: Request) {
  let body: ConfirmBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const checkoutId =
    typeof body.checkoutId === 'string' ? body.checkoutId.trim() : ''

  if (!checkoutId) {
    return NextResponse.json(
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
      return NextResponse.json({ error: 'Checkout not found' }, { status: 404 })
    }

    try {
      const recorded = await recordPaidFeatureVoteCheckout(checkout)

      return NextResponse.json({
        accepted: true,
        ...recorded,
      })
    } catch (error) {
      if (error instanceof FeatureVoteRecordError && error.code === 'unpaid') {
        return NextResponse.json({
          accepted: false,
          status: error.status,
        })
      }

      if (error instanceof FeatureVoteRecordError) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      throw error
    }
  } catch (error) {
    console.error('feature vote confirm failed:', error)
    return NextResponse.json(
      {
        error: 'Failed to confirm feature vote',
      },
      { status: 500 },
    )
  }
}
