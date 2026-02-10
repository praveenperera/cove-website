'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Container } from '@/components/Container'
import { FeatureVoteModal } from '@/components/FeatureVoteModal'

type Feature = {
  productId: string
  name: string
  description: string | null
  totalSats: number
  voteCount: number
  lastVoteAt: string | null
}

function formatSats(sats: number) {
  return new Intl.NumberFormat('en-US').format(sats)
}

function displayName(name: string) {
  return name.trim().replace(/^Feature:\s*/i, '')
}

export default function NextFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/feature-votes/leaderboard', {
        cache: 'no-store',
      })
      const json = (await response.json().catch(() => ({}))) as {
        error?: string
        features?: Feature[]
      }

      if (!response.ok) {
        throw new Error(json?.error || 'Failed to load leaderboard')
      }

      setFeatures(json.features ?? [])
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Failed to load leaderboard',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  const totalSats = useMemo(
    () => features.reduce((sum, feature) => sum + feature.totalSats, 0),
    [features],
  )

  return (
    <Container className="py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-cyan-600 uppercase">
              Roadmap Votes
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Vote on what Cove builds next
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600">
              Each vote is a sats donation. The leaderboard is ranked by total
              sats contributed per feature.
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Total sats voted</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatSats(totalSats)}
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-900"
          >
            Back to home
          </Link>

          <button
            onClick={fetchLeaderboard}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            Loading leaderboard...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && features.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
            No feature products found. Create MDK products prefixed with
            <span className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
              Feature:
            </span>
            to populate this page.
          </div>
        )}

        {!loading && !error && features.length > 0 && (
          <div className="space-y-3">
            {features.map((feature, index) => (
              <article
                key={feature.productId}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Rank #{index + 1}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-gray-900">
                      {displayName(feature.name)}
                    </h2>
                    {feature.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {feature.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-500">Total votes</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatSats(feature.totalSats)} sats
                      </p>
                      <p className="text-xs text-gray-500">
                        {feature.voteCount} payment
                        {feature.voteCount === 1 ? '' : 's'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedFeature(feature)
                        setModalOpen(true)
                      }}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      Vote with sats
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <FeatureVoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        feature={
          selectedFeature
            ? {
                productId: selectedFeature.productId,
                name: selectedFeature.name,
                description: selectedFeature.description,
              }
            : null
        }
        onVoteRecorded={fetchLeaderboard}
      />
    </Container>
  )
}
