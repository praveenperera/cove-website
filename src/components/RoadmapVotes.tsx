'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import { Container } from '@/components/Container'
import { FeatureVoteModal } from '@/components/FeatureVoteModal'
import { displayName, formatSats } from '@/lib/feature-votes/format'
import type { Feature } from '@/lib/feature-votes/types'

function rankBadgeClasses(rank: number) {
  if (rank === 1) return 'bg-amber-400 text-gray-900'
  if (rank === 2) return 'bg-blue-400 text-white'
  if (rank === 3) return 'bg-orange-400 text-white'
  return 'bg-white/10 text-white'
}

function FeatureCard({
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex flex-col rounded-2xl border border-white/10 bg-white/5 px-6 py-6"
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${rankBadgeClasses(rank)}`}
        >
          {rank}
        </span>
        <h3 className="line-clamp-2 text-base font-semibold text-white">
          {displayName(feature.name)}
        </h3>
      </div>

      {feature.description && (
        <p className="mb-4 line-clamp-2 text-sm text-gray-400">
          {feature.description}
        </p>
      )}

      <div className="mt-auto">
        <p className="text-xl font-bold text-white tabular-nums">
          {formatSats(feature.totalSats)}{' '}
          <span className="text-sm font-medium text-gray-400">sats</span>
        </p>
        <p className="mt-0.5 text-xs text-gray-500">
          {feature.voteCount} vote{feature.voteCount === 1 ? '' : 's'}
        </p>
      </div>

      <button
        onClick={onVote}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-[0.98]"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
        </svg>
        Vote with sats
      </button>
    </motion.div>
  )
}

function SkeletonCards() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/10" />
      ))}
    </div>
  )
}

export function RoadmapVotes() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchLeaderboard = useCallback(async () => {
    setError(false)

    try {
      const res = await fetch('/api/feature-votes/leaderboard', {
        cache: 'no-store',
      })

      if (!res.ok) throw new Error()

      const json = (await res.json().catch(() => ({}))) as {
        features?: Feature[]
      }

      setFeatures(json.features ?? [])
    } catch {
      setFeatures((prev) => {
        if (prev.length === 0) setError(true)
        return prev
      })
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

  if (!loading && (error || features.length === 0)) return null

  const topFeatures = features.slice(0, 3)

  function openVoteModal(feature: Feature) {
    setSelectedFeature(feature)
    setModalOpen(true)
  }

  return (
    <section className="relative isolate overflow-hidden bg-gray-900 py-20 sm:py-28">
      <svg
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
      >
        <circle
          r={512}
          cx={512}
          cy={512}
          fill="url(#roadmap-gradient)"
          fillOpacity="0.25"
        />
        <defs>
          <radialGradient id="roadmap-gradient">
            <stop stopColor="#F59E0B" />
            <stop offset={1} stopColor="#D97706" />
          </radialGradient>
        </defs>
      </svg>

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Vote on what Cove builds next
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Every vote is a Lightning donation. Your sats help shape what gets
            built next.
          </p>
        </div>

        {loading ? (
          <SkeletonCards />
        ) : (
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
            {topFeatures.map((feature, i) => (
              <FeatureCard
                key={feature.productId}
                feature={feature}
                rank={i + 1}
                index={i}
                onVote={() => openVoteModal(feature)}
              />
            ))}
          </div>
        )}

        {!loading && features.length > 0 && (
          <div className="mx-auto mt-10 flex max-w-md items-center justify-center divide-x divide-white/10 text-center">
            <div className="px-5">
              <p className="text-xl font-bold text-white tabular-nums">
                {formatSats(totalSats)}
              </p>
              <p className="text-xs text-gray-400">Total Sats</p>
            </div>
            <div className="px-5">
              <p className="text-xl font-bold text-white tabular-nums">
                {totalVotes}
              </p>
              <p className="text-xs text-gray-400">Votes</p>
            </div>
            <div className="px-5">
              <p className="text-xl font-bold text-white tabular-nums">
                {features.length}
              </p>
              <p className="text-xs text-gray-400">Features</p>
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
          >
            View Full Roadmap
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>

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
    </section>
  )
}
