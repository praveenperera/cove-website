import nextConfig from 'eslint-config-next'

export default [
  ...nextConfig,
  {
    rules: {
      // equivalent to "next/core-web-vitals"
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
]
