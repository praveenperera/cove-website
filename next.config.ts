import withMdkCheckout, {
  type NextConfigOverrides,
} from '@moneydevkit/nextjs/next-plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const configDir = path.dirname(fileURLToPath(import.meta.url))
const siteOrigin =
  process.env.COVE_SITE_ORIGIN ?? 'https://covebitcoinwallet.com'

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  `connect-src 'self' ${siteOrigin} https://*.vercel-insights.com https://vitals.vercel-insights.com`,
  "font-src 'self' https://fonts.gstatic.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  `img-src 'self' data: blob: ${siteOrigin}`,
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-insights.com https://vitals.vercel-insights.com",
  "style-src 'self' 'unsafe-inline'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
]

const nextConfig = {
  turbopack: {
    root: configDir,
  },
  allowedDevOrigins: ['localhost:4321'],
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
        source: '/app-stores',
        destination: `${siteOrigin}/app-stores`,
        permanent: true,
      },
      {
        source: '/download',
        destination: `${siteOrigin}/download`,
        permanent: true,
      },
      {
        source: '/privacy',
        destination: `${siteOrigin}/privacy`,
        permanent: true,
      },
      {
        source: '/terms',
        destination: `${siteOrigin}/terms`,
        permanent: true,
      },
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
        source: '/roadmap',
        destination: '/',
        permanent: true,
      },
      {
        source: '/next-features',
        destination: '/',
        permanent: true,
      },
    ]
  },
} satisfies NextConfigOverrides

export default withMdkCheckout(nextConfig)
