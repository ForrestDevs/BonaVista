'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function CartClose() {
  const router = useRouter()
  return (
    <Button variant={'outline'} onClick={() => router.back()} className="w-full">
      Continue Shopping
    </Button>
  )
}

export default CartClose
