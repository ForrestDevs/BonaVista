import React from 'react'
import { Button } from '@components/ui/button'
import { YnsLink } from '@components/ui/link'

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-4">
        Looks like you haven&apos;t added any items to your cart yet.
      </p>
      <YnsLink href="/shop">
        <Button>Continue Shopping</Button>
      </YnsLink>
    </div>
  )
}
