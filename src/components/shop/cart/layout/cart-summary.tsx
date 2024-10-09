'use client'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { YnsLink } from '@/components/ui/link'
import { CartItems } from '@payload-types'
import { HttpTypes } from '@medusajs/types'

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

export function CartSummary({ cart }: SummaryProps) {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="text-3xl font-semibold mb-4">Summary</h2>

      {/* <DiscountCode cart={cart} /> */}
      <Separator />

      {/* <CartTotals data={cart} /> */}

      <YnsLink href={'/checkout?step='} data-testid="checkout-button">
        <Button className="w-full">Go to checkout</Button>
      </YnsLink>
    </div>
  )
}
