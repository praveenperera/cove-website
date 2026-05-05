import { NextResponse } from 'next/server'
import { Webhook, WebhookVerificationError } from 'standardwebhooks'

import {
  callMdk,
  FeatureVoteRecordError,
  recordPaidFeatureVoteCheckout,
  type MdkCheckout,
} from '@/lib/feature-votes/server'

export const runtime = 'nodejs'

type MdkWebhookPayload = {
  type?: unknown
  event?: unknown
  data?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function headerValue(request: Request, name: string): string {
  return request.headers.get(name) ?? ''
}

function verifyWebhookPayload(
  payload: string,
  request: Request,
): MdkWebhookPayload {
  const secret = process.env.MDK_WEBHOOK_SECRET

  if (!secret) {
    throw new Error('MDK_WEBHOOK_SECRET is not configured')
  }

  const webhook = new Webhook(secret)
  const verified = webhook.verify(payload, {
    'webhook-id': headerValue(request, 'webhook-id'),
    'webhook-timestamp': headerValue(request, 'webhook-timestamp'),
    'webhook-signature': headerValue(request, 'webhook-signature'),
  })

  if (!isRecord(verified)) {
    throw new Error('Invalid webhook payload')
  }

  return verified
}

function getEventType(payload: MdkWebhookPayload): string {
  if (typeof payload.type === 'string') return payload.type
  if (typeof payload.event === 'string') return payload.event
  return ''
}

function extractCheckoutId(payload: MdkWebhookPayload): string {
  if (!isRecord(payload.data)) return ''

  const checkoutId = payload.data.checkoutId
  if (typeof checkoutId === 'string') return checkoutId.trim()

  const id = payload.data.id
  if (typeof id === 'string') return id.trim()

  const checkout = payload.data.checkout
  if (!isRecord(checkout)) return ''

  const nestedId = checkout.id
  return typeof nestedId === 'string' ? nestedId.trim() : ''
}

async function getCheckout(checkoutId: string): Promise<MdkCheckout | null> {
  const checkoutResponse = await callMdk<{ data?: MdkCheckout }>({
    handler: 'get_checkout',
    checkoutId,
  })

  return checkoutResponse.data ?? null
}

export async function POST(request: Request) {
  const rawBody = await request.text()

  let payload: MdkWebhookPayload

  try {
    payload = verifyWebhookPayload(rawBody, request)
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 },
      )
    }

    if (
      error instanceof Error &&
      error.message === 'MDK_WEBHOOK_SECRET is not configured'
    ) {
      console.error('MDK webhook secret is not configured')
      return NextResponse.json(
        { error: 'Webhook secret is not configured' },
        { status: 500 },
      )
    }

    console.error('MDK webhook verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid webhook payload' },
      { status: 400 },
    )
  }

  const eventType = getEventType(payload)

  if (eventType !== 'checkout.completed') {
    return NextResponse.json({ received: true, ignored: true, eventType })
  }

  const checkoutId = extractCheckoutId(payload)

  if (!checkoutId) {
    console.error('MDK checkout.completed webhook missing checkout id')
    return NextResponse.json(
      { error: 'checkout.completed payload is missing checkout id' },
      { status: 400 },
    )
  }

  try {
    const checkout = await getCheckout(checkoutId)

    if (!checkout) {
      return NextResponse.json({ error: 'Checkout not found' }, { status: 404 })
    }

    const recorded = await recordPaidFeatureVoteCheckout(checkout)

    return NextResponse.json({
      received: true,
      accepted: true,
      ...recorded,
    })
  } catch (error) {
    if (
      error instanceof FeatureVoteRecordError &&
      (error.code === 'non_feature_product' || error.code === 'missing_product')
    ) {
      return NextResponse.json({
        received: true,
        ignored: true,
        reason: error.code,
      })
    }

    if (error instanceof FeatureVoteRecordError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('MDK webhook handling failed:', error)
    return NextResponse.json(
      { error: 'Failed to process MDK webhook' },
      { status: 500 },
    )
  }
}
