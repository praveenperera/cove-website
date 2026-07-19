'use client'

export function NavLinks() {
  const links = [
    ['Features', 'https://covebitcoinwallet.com/#features'],
    ['Vote Roadmap', 'https://roadmap.covebitcoinwallet.com/'],
  ] as const

  return links.map(([label, href]) => (
    <a
      key={label}
      href={href}
      className="text-sm text-gray-700 transition-colors hover:text-gray-900"
    >
      {label}
    </a>
  ))
}
