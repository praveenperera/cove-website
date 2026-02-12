import { createClient } from '@libsql/client'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'

import {
  FEATURE_PRODUCT_PREFIX,
  extractCheckoutProductId,
  extractSettledSats,
  isPaidCheckout,
  type MdkCheckout,
} from '../src/lib/feature-votes/server'

type MdkProduct = {
  id: string
  name: string
}

function createMdkRpcClient() {
  const accessToken = process.env.MDK_ACCESS_TOKEN
  if (!accessToken) throw new Error('MDK_ACCESS_TOKEN is not configured')

  const link = new RPCLink({
    url: 'https://moneydevkit.com/rpc',
    headers: () => ({ 'x-api-key': accessToken }),
  })

  return createORPCClient(link)
}

async function main() {
  const dbUrl = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!dbUrl) {
    console.error('TURSO_DATABASE_URL is not set')
    process.exit(1)
  }

  if (!authToken) {
    console.error('TURSO_AUTH_TOKEN is not set')
    process.exit(1)
  }

  const db = createClient({ url: dbUrl, authToken })
  const client = createMdkRpcClient()

  // get all feature products from MDK via oRPC
  const { products: allProducts }: { products: MdkProduct[] } = await (
    client as any
  ).products.list({})

  const featureProducts = allProducts.filter((p) =>
    p.name.trim().startsWith(FEATURE_PRODUCT_PREFIX),
  )

  if (featureProducts.length === 0) {
    console.log('No feature products found')
    return
  }

  const featureProductIds = new Set(featureProducts.map((p) => p.id))
  console.log(
    `Found ${featureProducts.length} feature products:`,
    featureProducts.map((p) => `${p.name} (${p.id})`),
  )

  // checkout listing is not available on the SDK oRPC endpoint,
  // so checkout IDs must be passed as CLI args (from MDK dashboard or MCP tool)
  const checkoutIds = process.argv
    .slice(2)
    .flatMap((arg) => arg.split(','))
    .map((id) => id.trim())
    .filter(Boolean)

  if (checkoutIds.length === 0) {
    console.error(
      'Usage: npx tsx scripts/reconcile-votes.ts <checkout_id1,checkout_id2,...>',
    )
    process.exit(1)
  }

  console.log(`Fetching ${checkoutIds.length} checkouts from MDK...`)

  // fetch each checkout via oRPC checkout.get
  const allCheckouts: MdkCheckout[] = []
  for (const checkoutId of checkoutIds) {
    try {
      const checkout: MdkCheckout = await (client as any).checkout.get({
        id: checkoutId,
      })
      allCheckouts.push(checkout)
    } catch (err) {
      console.warn(`  Failed to fetch checkout ${checkoutId}: ${err}`)
    }
  }
  console.log(`Fetched ${allCheckouts.length} checkouts from MDK`)

  // filter to paid checkouts for feature products
  const paidFeatureCheckouts = allCheckouts.filter((c) => {
    const productId = extractCheckoutProductId(c)
    return productId && featureProductIds.has(productId) && isPaidCheckout(c)
  })

  console.log(
    `Found ${paidFeatureCheckouts.length} paid feature vote checkouts`,
  )

  if (paidFeatureCheckouts.length === 0) return

  // check which are already in the DB
  const placeholders = paidFeatureCheckouts.map(() => '?').join(', ')
  const existing = await db.execute({
    sql: `SELECT checkout_id FROM feature_vote_events WHERE checkout_id IN (${placeholders})`,
    args: paidFeatureCheckouts.map((c) => c.id),
  })

  const existingIds = new Set(existing.rows.map((r) => r.checkout_id as string))
  const missing = paidFeatureCheckouts.filter((c) => !existingIds.has(c.id))

  console.log(`${existingIds.size} already recorded, ${missing.length} missing`)

  // insert missing votes
  let reconciled = 0
  for (const checkout of missing) {
    const productId = extractCheckoutProductId(checkout)!
    const settledSats = extractSettledSats(checkout)

    if (settledSats <= 0) {
      console.warn(
        `  Skipping ${checkout.id}: could not determine settled sats`,
      )
      continue
    }

    const recordedAt = new Date().toISOString()

    const result = await db.execute({
      sql: `
        INSERT INTO feature_vote_events (
          checkout_id, product_id, settled_sats,
          checkout_status, recorded_at, raw_checkout_json
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(checkout_id) DO NOTHING
      `,
      args: [
        checkout.id,
        productId,
        settledSats,
        checkout.status,
        recordedAt,
        JSON.stringify(checkout),
      ],
    })

    if ((result.rowsAffected ?? 0) > 0) {
      reconciled++
      console.log(
        `  Inserted: checkout=${checkout.id} product=${productId} sats=${settledSats}`,
      )
    }
  }

  console.log(`\nReconciliation complete: ${reconciled} votes inserted`)
}

main().catch((err) => {
  console.error('Reconciliation failed:', err)
  process.exit(1)
})
