import assert from 'node:assert/strict'
import test from 'node:test'

import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  storeUrlForUserAgent,
} from '../src/lib/store-redirect.ts'

test('download routing selects the mobile platform store', () => {
  assert.equal(storeUrlForUserAgent('Mozilla/5.0 (iPhone)'), APP_STORE_URL)
  assert.equal(
    storeUrlForUserAgent('Mozilla/5.0 (Linux; Android 15)'),
    PLAY_STORE_URL,
  )
  assert.equal(storeUrlForUserAgent('Mozilla/5.0 (Macintosh)'), null)
})
