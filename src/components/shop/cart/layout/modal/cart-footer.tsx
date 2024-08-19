
import React from 'react'
import { Button } from '@/components/ui/button'
import { YnsLink } from '@/components/ui/link'
import { CartClose } from './cart-close'
import { CartTotal } from './cart-total'

export function CartFooter() {
  return (
    <div className="p-4 border-t">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium">Subtotal</span>
        <CartTotal />
      </div>
      <YnsLink href="/shop/checkout">
        <Button className="w-full mb-2">Proceed to Checkout</Button>
      </YnsLink>
      <CartClose />
    </div>
  )
}
