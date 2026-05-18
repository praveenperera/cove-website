import withMdkCheckout, {
  type NextConfigOverrides,
} from '@moneydevkit/nextjs/next-plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const configDir = path.dirname(fileURLToPath(import.meta.url))

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
]

const nextConfig = {
  turbopack: {
    root: configDir,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/appstore',
        destination:
          'https://apps.apple.com/app/cove-simple-bitcoin-wallet/id6642680364',
        permanent: true,
      },
      {
        source: '/app-store',
        destination:
          'https://apps.apple.com/app/cove-simple-bitcoin-wallet/id6642680364',
        permanent: true,
      },
      {
        source: '/beta',
        destination: 'https://testflight.apple.com/join/pDxFQsxF',
        permanent: true,
      },
      {
        source: '/test-flight',
        destination:
          'https://apps.apple.com/app/cove-simple-bitcoin-wallet/id6642680364',
        permanent: true,
      },
      {
        source: '/testflight',
        destination:
          'https://apps.apple.com/app/cove-simple-bitcoin-wallet/id6642680364',
        permanent: true,
      },
      {
        source: '/next-features',
        destination: '/roadmap',
        permanent: true,
      },
    ]
  },
} satisfies NextConfigOverrides

export default withMdkCheckout(nextConfig)
