export type Feature = {
  productId: string
  name: string
  description: string | null
  totalSats: number
  voteCount: number
  lastVoteAt: string | null
}

export type FeatureCardProps = {
  feature: Feature
  rank: number
  index: number
  onVote: () => void
}
