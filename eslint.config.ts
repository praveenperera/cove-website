import nextConfig from 'eslint-config-next'

const config = [
  ...nextConfig,
  {
    rules: {
      // equivalent to "next/core-web-vitals"
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
]

export default config
