import {
  corsJson,
  corsOptions,
  rejectDisallowedBrowserOrigin,
} from '@/lib/cors'
import { callMdk, type MdkCheckout } from '@/lib/feature-votes/server'

const methods = ['POST', 'OPTIONS'] as const

type CreateDonationBody = {
  amount?: unknown
  currency?: unknown
}

export function OPTIONS(request: Request) {
  return corsOptions(request, methods)
}

export async function POST(request: Request) {
  const rejection = rejectDisallowedBrowserOrigin(request, methods)
  if (rejection) return rejection

  let body: CreateDonationBody
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

  const currency =
    body.currency === 'USD' || body.currency === 'SAT' ? body.currency : null
  const amount = typeof body.amount === 'number' ? Math.round(body.amount) : NaN
  const minimum = currency === 'USD' ? 100 : 1

  if (!currency || !Number.isFinite(amount) || amount < minimum) {
    return corsJson(
      request,
      methods,
      { error: 'Enter a valid donation amount' },
      { status: 400 },
    )
  }

  try {
    const response = await callMdk<{ data?: MdkCheckout }>({
      handler: 'create_checkout',
      params: {
        type: 'AMOUNT',
        title: 'Donate to Cove',
        description: 'Support the development of Cove bitcoin wallet',
        amount,
        currency,
        successUrl: 'https://covebitcoinwallet.com/',
      },
    })
    const checkout = response.data

    if (!checkout?.invoice?.invoice || !checkout.invoice.expiresAt) {
      return corsJson(
        request,
        methods,
        { error: 'Payment provider did not return an invoice' },
        { status: 502 },
      )
    }

    return corsJson(request, methods, {
      data: {
        id: checkout.id,
        currency,
        invoiceAmountSats: checkout.invoiceAmountSats ?? null,
        invoice: checkout.invoice,
      },
    })
  } catch (error) {
    console.error('donation create-checkout failed:', error)
    return corsJson(
      request,
      methods,
      { error: 'Failed to create donation invoice' },
      { status: 500 },
    )
  }
}
