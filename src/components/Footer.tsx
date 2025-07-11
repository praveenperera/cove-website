'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { NavLinks } from '@/components/NavLinks'
import qrCode from '@/images/qr-code.svg'
import logo from '@/images/cove_logo.jpg'
import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'

function QrCodeBorder(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1 17V9a8 8 0 0 1 8-8h8M95 17V9a8 8 0 0 0-8-8h-8M1 79v8a8 8 0 0 0 8 8h8M95 79v8a8 8 0 0 1-8 8h-8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Footer() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex flex-col items-start justify-between gap-y-12 pt-16 pb-6 lg:flex-row lg:items-center lg:py-16">
          <div>
            <div className="flex items-center text-gray-900">
              <Image src={logo} alt="" width={40} className="mr-4" />
              <div className="ml-4">
                <p className="text-base font-semibold">Cove</p>
                <p className="mt-1 text-sm">
                  The simple bitcoin only mobile wallet
                </p>
              </div>
            </div>
            <nav className="mt-11 flex gap-8">
              <NavLinks />
            </nav>
          </div>
          <div className="group relative -mx-4 flex items-center self-stretch p-4 transition-colors hover:bg-gray-100 sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6">
            <div className="relative flex h-24 w-24 flex-none items-center justify-center">
              <QrCodeBorder className="absolute inset-0 h-full w-full stroke-gray-300 transition-colors group-hover:stroke-cyan-500" />
              <Image src={qrCode} alt="" unoptimized />
            </div>
            <div className="ml-8 lg:w-64">
              <p className="text-base font-semibold text-gray-900 sm:flex">
                <Link href="https://apps.apple.com/app/cove-simple-bitcoin-wallet/id6642680364">
                  <span className="absolute inset-0 sm:rounded-2xl" />
                  Download on the App Store
                </Link>
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Scan the QR code to download the app from the App Store.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center border-t border-gray-200 pt-8 pb-12 md:flex-row-reverse md:justify-between md:pt-6">
          <p className="mt-6 text-sm text-gray-500 md:mt-0">
            &copy; Copyright {new Date().getFullYear()}. All rights reserved.
            {' '}<Link href="/terms" className="underline hover:text-gray-700">Terms</Link>{' '}
            &middot;{' '}<Link href="/privacy" className="underline hover:text-gray-700">Privacy</Link>
          </p>
          <Button
            variant="solid"
            color="blue"
            href="https://twitter.com/covewallet?ref_src=twsrc%5Etfw"
            className="text-xs"
          >
            Follow on x @covewallet
          </Button>
        </div>
      </Container>
    </footer>
  )
}
