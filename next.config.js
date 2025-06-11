/** @type {import('next').NextConfig} */
const nextConfig = {
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
        source: '/TestFlight',
        destination: 'https://testflight.apple.com/join/pDxFQsxF',
        permanent: true,
      },
      {
        source: '/test-flight',
        destination: 'https://testflight.apple.com/join/pDxFQsxF',
        permanent: true,
      },
      {
        source: '/testflight',
        destination: 'https://testflight.apple.com/join/pDxFQsxF',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
