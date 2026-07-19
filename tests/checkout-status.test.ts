import assert from 'node:assert/strict'
import test from 'node:test'

import { isPaidCheckoutStatus } from '../src/lib/checkout-status.ts'

test('only a fully received payment is paid', () => {
  assert.equal(isPaidCheckoutStatus('PAYMENT_RECEIVED'), true)
  assert.equal(isPaidCheckoutStatus('CONFIRMED'), false)
  assert.equal(isPaidCheckoutStatus('PENDING_PAYMENT'), false)
  assert.equal(isPaidCheckoutStatus('EXPIRED'), false)
  assert.equal(isPaidCheckoutStatus('UNKNOWN_FUTURE_STATUS'), false)
})
