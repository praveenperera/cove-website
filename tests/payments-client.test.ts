import assert from 'node:assert/strict'
import test from 'node:test'

import { paymentApiUrl } from '../src/lib/payments-client.ts'

test('payment API URLs work on both site origins', () => {
  assert.equal(
    paymentApiUrl('', '/api/checkouts/1/status'),
    '/api/checkouts/1/status',
  )
  assert.equal(
    paymentApiUrl(
      'https://roadmap.covebitcoinwallet.com/',
      '/api/checkouts/1/status',
    ),
    'https://roadmap.covebitcoinwallet.com/api/checkouts/1/status',
  )
})
