'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function CartClose() {
  const router = useRouter()
  return (
    <Button variant={'outline'} onClick={() => router.back()} className="w-full">
      Continue Shopping
    </Button>
  )
}
