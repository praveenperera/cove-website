import nextConfig from 'eslint-config-next'

const config = [
  {
    ignores: [
      'apps/site/dist/**',
      'apps/site/.astro/**',
      'apps/site/worker-configuration.d.ts',
    ],
  },
  ...nextConfig,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
]

export default config
