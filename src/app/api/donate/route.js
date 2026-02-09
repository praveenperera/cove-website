import { createCheckoutUrl } from '@moneydevkit/nextjs/server'
import { redirect } from 'next/navigation'

export async function GET() {
  const url = createCheckoutUrl({
    type: 'AMOUNT',
    title: 'Donate to Cove',
    description: 'Support the development of Cove bitcoin wallet',
    amount: 500,
    currency: 'USD',
    successUrl: '/checkout/success',
  })

  redirect(url)
}
