import withMdkCheckout from '@moneydevkit/nextjs/next-plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const configDir = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: configDir,
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
}

export default withMdkCheckout(nextConfig)
