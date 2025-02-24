import { CircleBackground } from '@/components/CircleBackground'
import { Container } from '@/components/Container'
import { TestFlightLink } from './TestFlightLink'

export function CallToAction() {
  return (
    <section
      id="get-free-shares-today"
      className="overflow-hidden relative py-20 bg-gray-900 sm:py-28"
    >
      <div className="absolute left-20 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
        <CircleBackground color="#fff" className="animate-spin-slower" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-md sm:text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Try it out today!
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Easy to get started, fully featured, whether its your first wallet
            or you're a certified bitcoin OG. Cove is the wallet for you.
          </p>
          <div className="flex justify-center mt-8">
            <TestFlightLink color="white" />
          </div>
        </div>
      </Container>
    </section>
  )
}
