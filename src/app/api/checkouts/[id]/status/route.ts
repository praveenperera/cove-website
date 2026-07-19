import {
  corsJson,
  corsOptions,
  rejectDisallowedBrowserOrigin,
} from '@/lib/cors'
import { callMdk, type MdkCheckout } from '@/lib/feature-votes/server'

const methods = ['GET', 'OPTIONS'] as const

export function OPTIONS(request: Request) {
  return corsOptions(request, methods)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const rejection = rejectDisallowedBrowserOrigin(request, methods)
  if (rejection) return rejection

  const { id } = await params
  const checkoutId = id.trim()
  if (!checkoutId) {
    return corsJson(
      request,
      methods,
      { error: 'checkoutId is required' },
      { status: 400 },
    )
  }

  try {
    const response = await callMdk<{ data?: MdkCheckout }>({
      handler: 'get_checkout',
      checkoutId,
    })
    const checkout = response.data

    if (!checkout) {
      return corsJson(
        request,
        methods,
        { error: 'Checkout not found' },
        { status: 404 },
      )
    }

    return corsJson(request, methods, { status: checkout.status })
  } catch (error) {
    console.error('checkout status failed:', error)
    return corsJson(
      request,
      methods,
      { error: 'Failed to load checkout status' },
      { status: 500 },
    )
  }
}
