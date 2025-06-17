import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://covebitcoinwallet.com'),
  title: {
    template: '%s - Cove',
    default: 'Cove - The simple bitcoin only mobile wallet',
  },
  description:
    'Cove is a Bitcoin only mobile wallet that is simple to use, but feature rich.',
  openGraph: {
    title: 'Cove - The simple bitcoin only mobile wallet',
    description:
      'Cove is a Bitcoin only mobile wallet that is simple to use, but feature rich.',
    url: 'https://covebitcoinwallet.com',
    siteName: 'Cove',
    images: [
      {
        url: '/og_horizontal.jpg',
        width: 4800,
        height: 2520,
        alt: 'Cove Bitcoin Wallet Logo On Background',
      },
      {
        url: '/og_square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Cove Bitcoin Wallet Logo On Background',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'og:logo': '/og_square.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cove - The simple bitcoin only mobile wallet',
    description:
      'Cove is a Bitcoin only mobile wallet that is simple to use, but feature rich.',
    images: ['/og_square.jpg'],
    creator: '@praveenperera',
    site: '@covewallet',
  },
  keywords: [
    'cove',
    'bitcoin',
    'wallet',
    'mobile',
    'bitcoin only',
    'self custody',
    'pbst',
    'hardware wallet support',
  ],
  authors: [{ name: 'Praveen Perera' }],
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={clsx('bg-gray-50 antialiased', inter.variable)}>
      <body>{children}</body>
    </html>
  )
}
