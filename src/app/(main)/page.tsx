import { CallToAction } from '@/components/CallToAction'
import { Features } from '@/components/Features'
import { Hero } from '@/components/Hero'
import { RoadmapVotes } from '@/components/RoadmapVotes'

export default function Home() {
  return (
    <>
      <Hero />
      <CallToAction />
      <Features />
      <RoadmapVotes />
    </>
  )
}
