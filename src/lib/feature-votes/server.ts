import { createClient, type Client } from '@libsql/client'
import { POST as mdkPost } from '@moneydevkit/nextjs/server/route'

export const FEATURE_PRODUCT_PREFIX = 'Feature:'

export type FeatureProduct = {
  id: string
  name: string
  description: string | null
  prices: Array<{
    id: string
    currency: 'USD' | 'SAT'
    amountType: 'FIXED' | 'CUSTOM'
    priceAmount: number | null
  }>
}

export type MdkCheckout = {
  id: string
  status: string
  productId?: string | null
  product?: { id: string } | null
  products?: Array<{ id: string }> | null
  userMetadata?: Record<string, unknown> | null
  invoice?: {
    invoice: string
    expiresAt: string
    amountSats: number | null
    amountSatsReceived: number | null
    fiatAmount: number | null
  } | null
  invoiceAmountSats?: number | null
  providedAmount?: number | null
  totalAmount?: number | null
}

let _db: Client | null = null

function getDb(): Client {
  if (_db) return _db

  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    throw new Error('TURSO_DATABASE_URL is not configured')
  }

  _db = createClient({ url, authToken })
  return _db
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export async function callMdk<T>(payload: Record<string, unknown>): Promise<T> {
  const accessToken = process.env.MDK_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error('MDK_ACCESS_TOKEN is not configured')
  }

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

export async function listFeatureProducts(): Promise<FeatureProduct[]> {
  const response = await callMdk<{ data?: { products?: FeatureProduct[] } }>({
    handler: 'list_products',
  })

  const allProducts = response.data?.products ?? []

  return allProducts
    .filter((product) => product.name.trim().startsWith(FEATURE_PRODUCT_PREFIX))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getFeatureProductById(
  productId: string,
): Promise<FeatureProduct | null> {
  const products = await listFeatureProducts()
  return products.find((product) => product.id === productId) ?? null
}

export function extractCheckoutProductId(checkout: MdkCheckout): string | null {
  if (checkout.productId) return checkout.productId
  if (checkout.product?.id) return checkout.product.id

  const firstProduct = checkout.products?.[0]
  if (firstProduct?.id) return firstProduct.id

  const metadata = checkout.userMetadata
  const featureProductId =
    metadata && typeof metadata.featureProductId === 'string'
      ? metadata.featureProductId
      : null

  return featureProductId
}

export function extractSettledSats(checkout: MdkCheckout): number {
  const satsCandidates = [
    checkout.invoice?.amountSatsReceived,
    checkout.invoiceAmountSats,
    checkout.invoice?.amountSats,
    checkout.providedAmount,
    checkout.totalAmount,
  ]

  for (const candidate of satsCandidates) {
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      const sats = Math.round(candidate)
      if (sats > 0) return sats
    }
  }

  return 0
}

export function isPaidCheckout(checkout: MdkCheckout): boolean {
  return (
    checkout.status === 'PAYMENT_RECEIVED' || checkout.status === 'CONFIRMED'
  )
}

export async function insertFeatureVoteEvent(params: {
  checkoutId: string
  productId: string
  settledSats: number
  checkoutStatus: string
  rawCheckout: MdkCheckout
}): Promise<boolean> {
  const db = getDb()
  const recordedAt = new Date().toISOString()

  const result = await db.execute({
    sql: `
      INSERT INTO feature_vote_events (
        checkout_id,
        product_id,
        settled_sats,
        checkout_status,
        recorded_at,
        raw_checkout_json
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(checkout_id) DO NOTHING
    `,
    args: [
      params.checkoutId,
      params.productId,
      params.settledSats,
      params.checkoutStatus,
      recordedAt,
      JSON.stringify(params.rawCheckout),
    ],
  })

  return (result.rowsAffected ?? 0) > 0
}

export async function getVoteTotalsByProductId(
  productIds: string[],
): Promise<
  Map<
    string,
    { totalSats: number; voteCount: number; lastVoteAt: string | null }
  >
> {
  const totals = new Map<
    string,
    { totalSats: number; voteCount: number; lastVoteAt: string | null }
  >()

  if (productIds.length === 0) return totals

  const db = getDb()
  const placeholders = productIds.map(() => '?').join(', ')

  const result = await db.execute({
    sql: `
      SELECT product_id, total_sats, vote_count, last_vote_at
      FROM feature_vote_totals
      WHERE product_id IN (${placeholders})
    `,
    args: productIds,
  })

  for (const row of result.rows) {
    totals.set(row.product_id as string, {
      totalSats: Number(row.total_sats ?? 0),
      voteCount: Number(row.vote_count ?? 0),
      lastVoteAt: row.last_vote_at as string | null,
    })
  }

  return totals
}
