import { type Metadata } from 'next'
import Link from 'next/link'

import { AppStoreLink } from '@/components/AppStoreLink'
import { Container } from '@/components/Container'
import { GooglePlayLink } from '@/components/GooglePlayLink'
import { Logo } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Download',
  description: 'Download Cove for iOS or Android.',
}

export default function AppStoresPage() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <Link href="/" aria-label="Cove home">
          <Logo />
        </Link>

        <h1 className="mt-10 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
          Download Cove
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Get the simple bitcoin-only wallet on your phone.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <AppStoreLink />
          <GooglePlayLink />
        </div>

        <Link
          href="/"
          className="mt-12 text-sm font-medium text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline"
        >
          Back to home
        </Link>
      </div>
    </Container>
  )
}
