export const PAID_CHECKOUT_STATUS = 'PAYMENT_RECEIVED'

export function isPaidCheckoutStatus(status: string): boolean {
  return status === PAID_CHECKOUT_STATUS
}
