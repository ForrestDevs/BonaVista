'use client'

import { deleteCartCookieById } from '@/lib/data/cookies'
import { useRouter } from 'next/navigation'
import { startTransition, useEffect } from 'react'

// if current order cartId is the same as the cookie, clear the cookie
export const ClearCookieClientComponent = ({ cartId }: { cartId: string }) => {
  const router = useRouter()

  useEffect(() => {
    startTransition(async () => {
      await deleteCartCookieById(cartId)
      router.refresh()
    })
  }, [router, cartId])

  return null
}
