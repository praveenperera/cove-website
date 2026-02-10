'use client'

import { use } from 'react'
import { Checkout } from '@moneydevkit/nextjs'

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <Checkout id={id} />
}
