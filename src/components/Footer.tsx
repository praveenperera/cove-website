'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { useCheckout, Checkout } from '@moneydevkit/nextjs'

import { Container } from '@/components/Container'
import { NavLinks } from '@/components/NavLinks'
import qrCode from '@/images/qr-code.svg'
import logo from '@/images/cove_logo.jpg'
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
  const [showDonate, setShowDonate] = useState(false)
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const { createCheckout, isLoading } = useCheckout()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleDonate = async () => {
    setShowDonate(true)
    setCheckoutId(null)

    const result = await createCheckout({
      type: 'AMOUNT',
      title: 'Donate to Cove',
      description: 'Support the development of Cove bitcoin wallet',
      amount: 500,
      currency: 'USD',
      successUrl: '/checkout/success',
    })

    if (result.error) {
      setShowDonate(false)
      return
    }

    const id = result.data.checkoutUrl.split('/').pop()
    if (id) setCheckoutId(id)
  }

  const closeModal = () => {
    setShowDonate(false)
    setCheckoutId(null)
  }

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
              <p className="text-base font-semibold text-gray-900">
                <Link href="https://apps.apple.com/app/cove-simple-bitcoin-wallet/id6642680364">
                  <span className="absolute inset-0 sm:rounded-2xl" />
                  Download the app
                </Link>
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
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms
            </Link>{' '}
            &middot;{' '}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy
            </Link>
          </p>
          <div className="flex gap-3">
            <Button
              variant="solid"
              color="gray"
              className="text-xs"
              onClick={handleDonate}
              disabled={isLoading}
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

      <Dialog open={showDonate} onClose={closeModal} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Donate to Cove
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {checkoutId ? (
              <Checkout id={checkoutId} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
                <p className="mt-4 text-sm text-gray-500">
                  Creating checkout...
                </p>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </footer>
  )
}
