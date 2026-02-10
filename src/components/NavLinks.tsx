'use client'

import Link from 'next/link'

export function NavLinks() {
  const links = [
    ['Features', '/#features'],
    ['Vote Roadmap', '/roadmap'],
  ] as const

  return links.map(([label, href]) => (
    <Link
      key={label}
      href={href}
      className="text-sm text-gray-700 transition-colors hover:text-gray-900"
    >
      {label}
    </Link>
  ))
}
