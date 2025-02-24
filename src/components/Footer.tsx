import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { NavLinks } from '@/components/NavLinks'
import qrCode from '@/images/qr-code.svg'
import logo from '@/images/cove_logo.jpg'

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
  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex flex-col gap-y-12 justify-between items-start pt-16 pb-6 lg:flex-row lg:items-center lg:py-16">
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
            <nav className="flex gap-8 mt-11">
              <NavLinks />
            </nav>
          </div>
          <div className="flex relative items-center self-stretch p-4 -mx-4 transition-colors sm:self-auto sm:rounded-2xl lg:self-auto lg:p-6 lg:mx-0 hover:bg-gray-100 group">
            <div className="flex relative flex-none justify-center items-center w-24 h-24">
              <QrCodeBorder className="absolute inset-0 w-full h-full transition-colors stroke-gray-300 group-hover:stroke-cyan-500" />
              <Image src={qrCode} alt="" unoptimized />
            </div>
            <div className="ml-8 lg:w-64">
              <p className="text-base font-semibold text-gray-900 sm:flex">
                <Link href="https://TestFlight.apple.com/join/pDxFQsxF">
                  <span className="absolute inset-0 sm:rounded-2xl" />
                  Join TestFlight Beta
                </Link>
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Scan the QR code to download the app from TestFlight.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center pt-8 pb-12 border-t border-gray-200 md:flex-row-reverse md:justify-between md:pt-6">
          <p className="mt-6 text-sm text-gray-500 md:mt-0">
            &copy; Copyright {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
