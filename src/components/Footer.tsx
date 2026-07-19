'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { DonateModal } from '@/components/DonateModal'
import { NavLinks } from '@/components/NavLinks'

const downloadUrl = 'https://covebitcoinwallet.com/download'

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

export function Footer({ apiOrigin = '' }: { apiOrigin?: string }) {
  const [showDonate, setShowDonate] = useState(false)

  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex flex-col items-start justify-between gap-y-12 pt-16 pb-6 lg:flex-row lg:items-center lg:py-16">
          <div>
            <div className="flex items-center text-gray-900">
              <img
                src="/cove_logo.jpg"
                alt=""
                width={40}
                height={40}
                className="mr-4"
              />
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
              <QrCodeBorder className="absolute inset-0 h-full w-full stroke-gray-300 transition-colors group-hover:stroke-midnight-blue-600" />
              <QRCodeSVG value={downloadUrl} size={80} marginSize={1} />
            </div>
            <div className="ml-8 lg:w-64">
              <p className="text-base font-semibold text-gray-900">
                <a href="https://covebitcoinwallet.com/download">
                  <span className="absolute inset-0 sm:rounded-2xl" />
                  Download the app
                </a>
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Scan the QR code to download the app.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center border-t border-gray-200 pt-8 pb-12 md:flex-row-reverse md:justify-between md:pt-6">
          <p className="mt-6 text-sm text-gray-500 md:mt-0">
            &copy; Copyright {new Date().getFullYear()}. All rights reserved.{' '}
            <a
              href="https://covebitcoinwallet.com/terms"
              className="underline hover:text-gray-700"
            >
              Terms
            </a>{' '}
            &middot;{' '}
            <a
              href="https://covebitcoinwallet.com/privacy"
              className="underline hover:text-gray-700"
            >
              Privacy
            </a>{' '}
            &middot;{' '}
            <a
              href="mailto:support@covebitcoinwallet.com"
              className="underline hover:text-gray-700"
            >
              Support
            </a>
          </p>
          <div className="flex gap-3">
            <Button
              variant="solid"
              color="gray"
              className="text-xs"
              onClick={() => setShowDonate(true)}
            >
              Donate
            </Button>
            <Button
              variant="solid"
              color="blue"
              href="https://twitter.com/covewallet?ref_src=twsrc%5Etfw"
              className="text-xs"
            >
              Follow on x @covewallet
            </Button>
          </div>
        </div>
      </Container>

      <DonateModal
        open={showDonate}
        onClose={() => setShowDonate(false)}
        apiOrigin={apiOrigin}
      />
    </footer>
  )
}
