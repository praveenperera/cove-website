import { NextResponse } from 'next/server'

import {
  callMdk,
  getFeatureProductById,
  type MdkCheckout,
} from '@/lib/feature-votes/server'

type CreateCheckoutBody = {
  productId?: unknown
  amountSats?: unknown
}

export async function POST(request: Request) {
  let body: CreateCheckoutBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const productId =
    typeof body.productId === 'string' ? body.productId.trim() : ''
  const amountSats =
    typeof body.amountSats === 'number' ? Math.round(body.amountSats) : NaN

  if (!productId) {
    return NextResponse.json(
      { error: 'productId is required' },
      { status: 400 },
    )
  }

  if (!Number.isFinite(amountSats) || amountSats < 1) {
    return NextResponse.json(
      { error: 'amountSats must be an integer greater than 0' },
      { status: 400 },
    )
  }

  try {
    const product = await getFeatureProductById(productId)

    if (!product) {
      return NextResponse.json(
        { error: 'Feature product not found' },
        { status: 404 },
      )
    }

    const supportsSatCustom = product.prices.some(
      (price) => price.currency === 'SAT' && price.amountType === 'CUSTOM',
    )

    if (!supportsSatCustom) {
      return NextResponse.json(
        {
          error:
            'This product does not support custom SAT pricing. Configure a SAT CUSTOM price in MDK.',
        },
        { status: 400 },
      )
    }

    const createResponse = await callMdk<{ data?: MdkCheckout }>({
      handler: 'create_checkout',
      params: {
        type: 'PRODUCTS',
        product: product.id,
        successUrl: '/roadmap',
        metadata: {
          voteType: 'feature',
          featureProductId: product.id,
        },
      },
    })

    const checkoutId = createResponse.data?.id

    if (!checkoutId) {
      return NextResponse.json(
        { error: 'MDK create_checkout did not return a checkout id' },
        { status: 502 },
      )
    }

    const confirmResponse = await callMdk<{ data?: MdkCheckout }>({
      handler: 'confirm_checkout',
      confirm: {
        checkoutId,
        products: [
          {
            productId: product.id,
            priceAmount: amountSats,
          },
        ],
      },
    })

    const checkout = confirmResponse.data

    if (!checkout?.invoice?.invoice || !checkout.invoice.expiresAt) {
      return NextResponse.json(
        { error: 'MDK confirm_checkout did not return an invoice' },
        { status: 502 },
      )
    }

    return NextResponse.json({
      data: {
        checkoutId: checkout.id,
        invoice: checkout.invoice.invoice,
        expiresAt: checkout.invoice.expiresAt,
        amountSats:
          checkout.invoice.amountSats ??
          checkout.invoiceAmountSats ??
          amountSats,
        fiatAmount: checkout.invoice.fiatAmount,
        status: checkout.status,
      },
    })
  } catch (error) {
    console.error('feature vote create-checkout failed:', error)
    return NextResponse.json(
      {
        error: 'Failed to create feature vote checkout',
      },
      { status: 500 },
    )
  }
}
