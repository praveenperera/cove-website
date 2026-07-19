'use client'

import { useEffect } from 'react'

import { storeUrlForUserAgent } from '@/lib/store-redirect'

export function StoreRedirect() {
  useEffect(() => {
    const destination = storeUrlForUserAgent(navigator.userAgent)
    if (destination) window.location.replace(destination)
  }, [])

  return null
}
