import { NextResponse } from 'next/server'

import {
  callMdk,
  extractCheckoutProductId,
  extractSettledSats,
  getFeatureProductById,
  insertFeatureVoteEvent,
  isPaidCheckout,
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

    if (!isPaidCheckout(checkout)) {
      return NextResponse.json({
        accepted: false,
        status: checkout.status,
      })
    }

    const productId = extractCheckoutProductId(checkout)

    if (!productId) {
      return NextResponse.json(
        { error: 'Unable to resolve productId from checkout' },
        { status: 400 },
      )
    }

    const featureProduct = await getFeatureProductById(productId)

    if (!featureProduct) {
      return NextResponse.json(
        { error: 'Checkout product is not a feature vote product' },
        { status: 400 },
      )
    }

    const settledSats = extractSettledSats(checkout)

    if (settledSats <= 0) {
      return NextResponse.json(
        { error: 'Unable to determine settled sats for checkout' },
        { status: 400 },
      )
    }

    const inserted = await insertFeatureVoteEvent({
      checkoutId: checkout.id,
      productId,
      settledSats,
      checkoutStatus: checkout.status,
      rawCheckout: checkout,
    })

    return NextResponse.json({
      accepted: true,
      inserted,
      checkoutId: checkout.id,
      featureProductId: productId,
      settledSats,
      status: checkout.status,
    })
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
