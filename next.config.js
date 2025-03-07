/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/TestFlight',
        destination: 'https://testflight.apple.com/join/pDxFQsxF',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
