'use client'

import { deleteCartCookieById } from '@/lib/data/cookies'
import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'

// if current order cartId is the same as the cookie, clear the cookie
export const ClearCookieClientComponent = ({ cartId }: { cartId: string }) => {
  const router = useRouter()
  const [hasCleared, setHasCleared] = useState(false)

  useEffect(() => {
    if (!hasCleared) {
      startTransition(async () => {
        await deleteCartCookieById(cartId)
        setHasCleared(true)
        // Only refresh once after clearing the cookie
        router.refresh()
      })
    }
  }, [router, cartId, hasCleared])

  return null
}
