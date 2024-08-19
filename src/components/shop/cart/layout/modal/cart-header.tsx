import React from 'react'
import { YnsLink } from '@/components/ui/link'

export function CartHeader() {
  return (
    <div className="px-4 py-6 border-b flex items-center justify-between">
      <h2 className="text-lg font-semibold">Your Cart</h2>
      <YnsLink href="/shop/cart" className="text-sm text-muted-foreground underline">
        Open full view
      </YnsLink>
    </div>
  )
}
