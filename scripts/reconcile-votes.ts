import { createClient } from '@libsql/client'
import { POST as mdkPost } from '@moneydevkit/nextjs/server/route'

type MdkInvoice = {
  invoice: string
  expiresAt: string
  amountSats: number | null
  amountSatsReceived: number | null
  fiatAmount: number | null
}

type MdkCheckout = {
  id: string
  status: string
  productId?: string | null
  product?: { id: string } | null
  products?: Array<{ id: string }> | null
  userMetadata?: Record<string, unknown> | null
  invoice?: MdkInvoice | null
  invoiceAmountSats?: number | null
  providedAmount?: number | null
  totalAmount?: number | null
}

type MdkProduct = {
  id: string
  name: string
}

const FEATURE_PRODUCT_PREFIX = 'Feature:'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

async function callMdk<T>(payload: Record<string, unknown>): Promise<T> {
  const accessToken = process.env.MDK_ACCESS_TOKEN
  if (!accessToken) throw new Error('MDK_ACCESS_TOKEN is not configured')

  const request = new Request('https://internal.mdk/api', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-moneydevkit-webhook-secret': accessToken,
    },
    body: JSON.stringify(payload),
  })

  const response = await mdkPost(request)
  const json = await response.json().catch(() => null)

  if (!response.ok) {
    const error =
      isRecord(json) && typeof json.error === 'string'
        ? json.error
        : `MDK request failed (${response.status})`
    throw new Error(error)
  }

  return json as T
}

function extractProductId(checkout: MdkCheckout): string | null {
  if (checkout.productId) return checkout.productId
  if (checkout.product?.id) return checkout.product.id
  const first = checkout.products?.[0]
  if (first?.id) return first.id
  const meta = checkout.userMetadata?.featureProductId
  if (typeof meta === 'string') return meta
  return null
}

function extractSettledSats(checkout: MdkCheckout): number {
  const candidates = [
    checkout.invoice?.amountSats,
    checkout.invoiceAmountSats,
    checkout.invoice?.amountSatsReceived,
    checkout.providedAmount,
    checkout.totalAmount,
  ]

  for (const c of candidates) {
    if (typeof c === 'number' && Number.isFinite(c)) {
      const sats = Math.round(c)
      if (sats > 0) return sats
    }
  }

  return 0
}

function isPaid(checkout: MdkCheckout): boolean {
  return (
    checkout.status === 'PAYMENT_RECEIVED' ||
    checkout.status === 'CONFIRMED' ||
    (checkout.invoice?.amountSatsReceived ?? 0) > 0
  )
}

async function main() {
  const dbUrl = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!dbUrl) {
    console.error('TURSO_DATABASE_URL is not set')
    process.exit(1)
  }

  const db = createClient({ url: dbUrl, authToken })

  // get all feature products from MDK
  const { data: productsData } = await callMdk<{
    data?: { products?: MdkProduct[] }
  }>({ handler: 'list_products' })

  const featureProducts = (productsData?.products ?? []).filter((p) =>
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

  // get all checkouts from MDK
  const { data: checkoutsData } = await callMdk<{
    data?: { checkouts?: MdkCheckout[] }
  }>({ handler: 'list_checkouts' })

  const allCheckouts = checkoutsData?.checkouts ?? []
  console.log(`Found ${allCheckouts.length} total checkouts`)

  // filter to paid checkouts for feature products
  const paidFeatureCheckouts = allCheckouts.filter((c) => {
    const productId = extractProductId(c)
    return productId && featureProductIds.has(productId) && isPaid(c)
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

  console.log(
    `${existingIds.size} already recorded, ${missing.length} missing`,
  )

  // insert missing votes
  let reconciled = 0
  for (const checkout of missing) {
    const productId = extractProductId(checkout)!
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
