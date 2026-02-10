'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

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

function timeAgo(isoDate: string | null): string | null {
  if (!isoDate) return null
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days < 30 ? `${days}d ago` : `${Math.floor(days / 30)}mo ago`
}

function rankBadgeClasses(rank: number) {
  if (rank === 1) return 'bg-amber-400 text-white'
  if (rank === 2) return 'bg-blue-400 text-white'
  if (rank === 3) return 'bg-orange-400 text-white'
  return 'border-2 border-gray-200 text-gray-500'
}

function podiumCardClasses(rank: number) {
  if (rank === 1)
    return 'border-2 border-amber-200 bg-gradient-to-b from-amber-50/80 to-white shadow-lg'
  if (rank === 2)
    return 'border border-blue-200 bg-gradient-to-b from-blue-50/60 to-white shadow-md'
  if (rank === 3) return 'border border-gray-200 bg-white shadow-sm'
  return 'border border-gray-200 bg-white shadow-sm'
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
    </svg>
  )
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10 h-20 animate-pulse rounded-xl bg-gray-200" />
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  )
}

function StatsBar({
  totalSats,
  totalVotes,
  featureCount,
}: {
  totalSats: number
  totalVotes: number
  featureCount: number
}) {
  return (
    <div className="mx-auto mb-10 max-w-5xl rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-center divide-x divide-gray-200">
        <div className="px-5 text-center first:pl-0 last:pr-0">
          <p className="text-2xl font-bold tabular-nums text-gray-900 max-sm:text-lg">
            {formatSats(totalSats)}
          </p>
          <p className="text-sm text-gray-500">Total Sats</p>
        </div>
        <div className="px-5 text-center first:pl-0 last:pr-0">
          <p className="text-2xl font-bold tabular-nums text-gray-900 max-sm:text-lg">
            {totalVotes}
          </p>
          <p className="text-sm text-gray-500">Votes</p>
        </div>
        <div className="px-5 text-center first:pl-0 last:pr-0">
          <p className="text-2xl font-bold tabular-nums text-gray-900 max-sm:text-lg">
            {featureCount}
          </p>
          <p className="text-sm text-gray-500">Features</p>
        </div>
      </div>
    </div>
  )
}

function PodiumCard({
  feature,
  rank,
  index,
  onVote,
}: {
  feature: Feature
  rank: number
  index: number
  onVote: () => void
}) {
  const badgeSize = rank === 1 ? 'h-9 w-9 text-sm' : 'h-8 w-8 text-sm'
  const ago = timeAgo(feature.lastVoteAt)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`group flex min-h-[320px] flex-col rounded-2xl px-6 py-8 ${podiumCardClasses(rank)}`}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`inline-flex items-center justify-center rounded-full font-bold ${badgeSize} ${rankBadgeClasses(rank)}`}
        >
          {rank}
        </span>
      </div>

      <h2
        className={`font-bold text-gray-900 ${rank === 1 ? 'text-2xl' : 'text-xl'}`}
      >
        {displayName(feature.name)}
      </h2>

      {feature.description && (
        <p className="mt-1.5 text-sm text-gray-600">
          {feature.description}
        </p>
      )}

      <div className="mt-auto pt-6">
        <p className="text-2xl font-bold tabular-nums text-gray-900">
          {formatSats(feature.totalSats)}{' '}
          <span className="text-base font-medium text-gray-500">sats</span>
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <span>
            {feature.voteCount} vote{feature.voteCount === 1 ? '' : 's'}
          </span>
          {ago && (
            <>
              <span className="text-gray-300">&middot;</span>
              <span>{ago}</span>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onVote}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-midnight-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-midnight-blue-800 active:scale-[0.98]"
      >
        <LightningIcon className="h-4 w-4" />
        Vote with sats
      </button>
    </motion.article>
  )
}

function RankRow({
  feature,
  rank,
  index,
  maxSats,
  onVote,
}: {
  feature: Feature
  rank: number
  index: number
  maxSats: number
  onVote: () => void
}) {
  const pct = maxSats > 0 ? (feature.totalSats / maxSats) * 100 : 0
  const ago = timeAgo(feature.lastVoteAt)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24 + index * 0.08, duration: 0.4 }}
      className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
    >
      <span
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${rankBadgeClasses(rank)}`}
      >
        {rank}
      </span>

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold text-gray-900">
          {displayName(feature.name)}
        </h2>
        {feature.description && (
          <p className="truncate text-xs text-gray-500 group-hover:whitespace-normal">
            {feature.description}
          </p>
        )}
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-midnight-blue-700"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
          />
        </div>
      </div>

      <div className="shrink-0 min-w-[100px] text-right">
        <p className="text-sm font-semibold tabular-nums text-gray-900">
          {formatSats(feature.totalSats)} sats
        </p>
        <div className="flex items-center justify-end gap-1.5 text-xs text-gray-500">
          <span>
            {feature.voteCount} vote{feature.voteCount === 1 ? '' : 's'}
          </span>
          {ago && (
            <>
              <span className="text-gray-300">&middot;</span>
              <span>{ago}</span>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onVote}
        className="shrink-0 rounded-lg bg-midnight-blue-700 px-3 py-1.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-midnight-blue-800 active:scale-[0.98]"
      >
        Vote
      </button>
    </motion.article>
  )
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
    () => features.reduce((sum, f) => sum + f.totalSats, 0),
    [features],
  )

  const totalVotes = useMemo(
    () => features.reduce((sum, f) => sum + f.voteCount, 0),
    [features],
  )

  const maxSats = useMemo(
    () => Math.max(1, ...features.map((f) => f.totalSats)),
    [features],
  )

  const podiumFeatures = features.slice(0, Math.min(3, features.length))
  const remainingFeatures = features.slice(3)
  const hasPodium = podiumFeatures.length >= 3

  function openVoteModal(feature: Feature) {
    setSelectedFeature(feature)
    setModalOpen(true)
  }

  return (
    <Container className="py-12 sm:py-16">
      <div>
        {/* header */}
        <div className="mb-20">
          <p className="text-sm font-semibold tracking-wide text-midnight-blue-600 uppercase">
            Roadmap Votes
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Vote on what Cove builds next
          </h1>
          <p className="mt-3 max-w-2xl text-base text-gray-600">
            Each vote is a sats donation. The leaderboard is ranked by total
            sats contributed per feature.
          </p>
        </div>

        {loading && <LoadingSkeleton />}

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
          <>
            {/* podium section */}
            {hasPodium ? (
              <>
                {/* desktop: 3-column podium with rank 1 elevated center */}
                <div className="mx-auto mb-10 hidden max-w-5xl gap-6 md:grid md:grid-cols-3">
                  <PodiumCard
                    feature={podiumFeatures[1]}
                    rank={2}
                    index={1}
                    onVote={() => openVoteModal(podiumFeatures[1])}
                  />
                  <div className="-mt-8">
                    <PodiumCard
                      feature={podiumFeatures[0]}
                      rank={1}
                      index={0}
                      onVote={() => openVoteModal(podiumFeatures[0])}
                    />
                  </div>
                  <PodiumCard
                    feature={podiumFeatures[2]}
                    rank={3}
                    index={2}
                    onVote={() => openVoteModal(podiumFeatures[2])}
                  />
                </div>

                {/* mobile: stacked 1, 2, 3 */}
                <div className="mb-8 space-y-4 md:hidden">
                  {podiumFeatures.map((feature, i) => (
                    <PodiumCard
                      key={feature.productId}
                      feature={feature}
                      rank={i + 1}
                      index={i}
                      onVote={() => openVoteModal(feature)}
                    />
                  ))}
                </div>
              </>
            ) : (
              // fewer than 3 features: render as prominent stacked cards
              <div className="mb-8 space-y-4">
                {podiumFeatures.map((feature, i) => (
                  <PodiumCard
                    key={feature.productId}
                    feature={feature}
                    rank={i + 1}
                    index={i}
                    onVote={() => openVoteModal(feature)}
                  />
                ))}
              </div>
            )}

            <StatsBar
              totalSats={totalSats}
              totalVotes={totalVotes}
              featureCount={features.length}
            />

            {/* remaining features */}
            {remainingFeatures.length > 0 && (
              <div className="mx-auto max-w-5xl space-y-4">
                {remainingFeatures.map((feature, i) => (
                  <RankRow
                    key={feature.productId}
                    feature={feature}
                    rank={i + 4}
                    index={i}
                    maxSats={maxSats}
                    onVote={() => openVoteModal(feature)}
                  />
                ))}
              </div>
            )}
          </>
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
