import assert from 'node:assert/strict'
import test from 'node:test'

import { isAllowedCorsOrigin } from '../src/lib/cors-origin.ts'

const siteOrigins = new Set(['https://covebitcoinwallet.com'])

test('CORS permits only the exact site or API origin', () => {
  assert.equal(
    isAllowedCorsOrigin(
      'https://covebitcoinwallet.com',
      'https://roadmap.covebitcoinwallet.com',
      siteOrigins,
    ),
    true,
  )
  assert.equal(
    isAllowedCorsOrigin(
      'https://roadmap.covebitcoinwallet.com',
      'https://roadmap.covebitcoinwallet.com',
      siteOrigins,
    ),
    true,
  )
  assert.equal(
    isAllowedCorsOrigin(
      'https://covebitcoinwallet.com.attacker.example',
      'https://roadmap.covebitcoinwallet.com',
      siteOrigins,
    ),
    false,
  )
})
