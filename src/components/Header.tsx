'use client'

import Link from 'next/link'
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import { GitHubButton } from '@/components/Github'

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronUpIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MobileNavLink(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof PopoverButton<typeof Link>>,
    'as' | 'className'
  >,
) {
  return (
    <PopoverButton
      as={Link}
      className="block tracking-tight text-gray-700 text-base/7"
      {...props}
    />
  )
}

export function Header() {
  return (
    <header>
      <nav>
        <Container className="flex relative z-50 justify-between py-8">
          <div className="flex relative z-10 gap-16 items-center">
            <Link href="/" aria-label="Home">
              <Logo />
            </Link>
            <div className="hidden lg:flex lg:gap-10">
              <NavLinks />
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <Popover className="lg:hidden">
              {({ open }) => (
                <>
                  <PopoverButton
                    className="inline-flex relative z-10 items-center p-2 -m-2 rounded-lg stroke-gray-900 hover:bg-gray-200/50 hover:stroke-gray-600 focus:not-data-focus:outline-hidden active:stroke-gray-900"
                    aria-label="Toggle site navigation"
                  >
                    {({ open }) =>
                      open ? (
                        <ChevronUpIcon className="w-6 h-6" />
                      ) : (
                        <MenuIcon className="w-6 h-6" />
                      )
                    }
                  </PopoverButton>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <PopoverBackdrop
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur-sm"
                        />
                        <PopoverPanel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute inset-x-0 top-0 z-0 px-6 pt-32 pb-6 bg-gray-50 rounded-b-2xl shadow-2xl origin-top shadow-gray-900/20"
                        >
                          <div className="space-y-4">
                            <MobileNavLink href="/#features">
                              Features
                            </MobileNavLink>
                          </div>
                          <div className="flex flex-col gap-4 mt-8">
                            <GitHubButton href="https://github.com/bitcoinppl/cove" />
                            <Button href="https://apps.apple.com/app/cove-simple-bitcoin-wallet/id6642680364" className="items-center gap-2">
                              <svg viewBox="0 0 14 17" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                                <path d="M13.584 12.272a8.6 8.6 0 0 1-.855 1.545c-.45.641-.818 1.085-1.103 1.332-.44.406-.912.614-1.417.626-.363 0-.8-.103-1.31-.313-.51-.208-.98-.312-1.407-.312-.449 0-.93.104-1.445.312-.516.21-.932.32-1.25.33-.484.022-.968-.192-1.453-.643-.31-.27-.696-.733-1.16-1.39-.497-.703-.906-1.518-1.228-2.449C.636 10.333.474 9.389.474 8.475c0-1.052.227-1.96.682-2.72A4.005 4.005 0 0 1 2.585 4.33a3.85 3.85 0 0 1 1.937-.547c.385 0 .89.12 1.518.353.626.235.982.354 1.067.354.063 0 .466-.14 1.208-.416.7-.257 1.292-.363 1.773-.322 1.31.106 2.294.623 2.945 1.554-1.172.71-1.751 1.704-1.738 2.982.012.995.372 1.823 1.077 2.483a3.54 3.54 0 0 0 1.065.698c-.085.249-.176.487-.27.716ZM10.427.34c0 .78-.285 1.508-.853 2.182-.685.802-1.514 1.265-2.413 1.192a2.426 2.426 0 0 1-.018-.295c0-.749.326-1.55.905-2.205.289-.332.657-.608 1.103-.829A3.28 3.28 0 0 1 10.41.013c.012.11.017.22.017.327Z" />
                              </svg>
                              App Store
                            </Button>
                            <Button href="https://play.google.com/store/apps/details?id=org.bitcoinppl.cove" className="items-center gap-2">
                              <svg viewBox="0 0 50 56" fill="none" aria-hidden="true" className="h-4 w-4">
                                <path d="M1.1 1.6 1 3v40l.2 1.4 22-22L1.1 1.6Z" fill="#4285F4" />
                                <path d="m22.6 23 11-11L9.6-1.9a5.8 5.8 0 0 0-8.5 3.4L22.6 23Z" fill="#34A853" />
                                <path d="M22.4 21.8 1.1 44.4a5.7 5.7 0 0 0 8.5 3.5l24-13.8-11.2-12.3Z" fill="#EA4335" />
                                <path d="m44 18-10.4-6L22 22.4 33.7 34l10.2-6a5.8 5.8 0 0 0 .1-10Z" fill="#FBBC04" />
                              </svg>
                              Google Play
                              <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                                BETA
                              </span>
                            </Button>
                          </div>
                        </PopoverPanel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>
            <div className="flex gap-6 items-center max-lg:hidden">
              <GitHubButton href="https://github.com/bitcoinppl/cove" />
              <Button href="https://apps.apple.com/app/cove-simple-bitcoin-wallet/id6642680364" className="items-center gap-2">
                <svg viewBox="0 0 14 17" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                  <path d="M13.584 12.272a8.6 8.6 0 0 1-.855 1.545c-.45.641-.818 1.085-1.103 1.332-.44.406-.912.614-1.417.626-.363 0-.8-.103-1.31-.313-.51-.208-.98-.312-1.407-.312-.449 0-.93.104-1.445.312-.516.21-.932.32-1.25.33-.484.022-.968-.192-1.453-.643-.31-.27-.696-.733-1.16-1.39-.497-.703-.906-1.518-1.228-2.449C.636 10.333.474 9.389.474 8.475c0-1.052.227-1.96.682-2.72A4.005 4.005 0 0 1 2.585 4.33a3.85 3.85 0 0 1 1.937-.547c.385 0 .89.12 1.518.353.626.235.982.354 1.067.354.063 0 .466-.14 1.208-.416.7-.257 1.292-.363 1.773-.322 1.31.106 2.294.623 2.945 1.554-1.172.71-1.751 1.704-1.738 2.982.012.995.372 1.823 1.077 2.483a3.54 3.54 0 0 0 1.065.698c-.085.249-.176.487-.27.716ZM10.427.34c0 .78-.285 1.508-.853 2.182-.685.802-1.514 1.265-2.413 1.192a2.426 2.426 0 0 1-.018-.295c0-.749.326-1.55.905-2.205.289-.332.657-.608 1.103-.829A3.28 3.28 0 0 1 10.41.013c.012.11.017.22.017.327Z" />
                </svg>
                App Store
              </Button>
              <div className="relative">
                <Button href="https://play.google.com/store/apps/details?id=org.bitcoinppl.cove" className="items-center gap-2">
                  <svg viewBox="0 0 50 56" fill="none" aria-hidden="true" className="h-4 w-4">
                    <path d="M1.1 1.6 1 3v40l.2 1.4 22-22L1.1 1.6Z" fill="#4285F4" />
                    <path d="m22.6 23 11-11L9.6 -1.9a5.8 5.8 0 0 0-8.5 3.4L22.6 23Z" fill="#34A853" />
                    <path d="M22.4 21.8 1.1 44.4a5.7 5.7 0 0 0 8.5 3.5l24-13.8-11.2-12.3Z" fill="#EA4335" />
                    <path d="m44 18-10.4-6L22 22.4 33.7 34l10.2-6a5.8 5.8 0 0 0 .1-10Z" fill="#FBBC04" />
                  </svg>
                  Google Play
                </Button>
                <span className="absolute -right-2 -top-2 rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                  BETA
                </span>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  )
}
