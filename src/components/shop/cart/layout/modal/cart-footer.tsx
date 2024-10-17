import React from 'react'
import { Button } from '@components/ui/button'
import { YnsLink } from '@components/ui/link'
import { CartClose } from './cart-close'
import { CartTotal } from './cart-total'
import { getCart } from '@lib/data/cart'

export async function CartFooter() {
  return (
    <div className="p-4 border-t">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium">Subtotal</span>
        <CartTotal />
      </div>
      <YnsLink href="/shop/checkout?step=address">
        <Button className="w-full mb-2">Proceed to Checkout</Button>
      </YnsLink>
      <CartClose />
    </div>
  )
}
