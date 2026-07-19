/** @type {import('prettier').Options} */
module.exports = {
  singleQuote: true,
  semi: false,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/tailwind.css',
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
  ],
}
