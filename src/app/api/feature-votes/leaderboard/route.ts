import { NextResponse } from 'next/server'

import {
  getVoteTotalsByProductId,
  listFeatureProducts,
} from '@/lib/feature-votes/server'

export async function GET() {
  try {
    const products = await listFeatureProducts()
    const totals = await getVoteTotalsByProductId(
      products.map((product) => product.id),
    )

    const features = products
      .map((product) => {
        const total = totals.get(product.id)
        return {
          productId: product.id,
          name: product.name,
          description: product.description,
          totalSats: total?.totalSats ?? 0,
          voteCount: total?.voteCount ?? 0,
          lastVoteAt: total?.lastVoteAt ?? null,
        }
      })
      .sort((a, b) => {
        if (b.totalSats !== a.totalSats) return b.totalSats - a.totalSats
        if (b.voteCount !== a.voteCount) return b.voteCount - a.voteCount
        return a.name.localeCompare(b.name)
      })

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      features,
    })
  } catch (error) {
    console.error('feature vote leaderboard failed:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load feature leaderboard',
      },
      { status: 500 },
    )
  }
}
