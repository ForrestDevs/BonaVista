'use client'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { YnsLink } from '@/components/ui/link'
import { CartItems } from '@payload-types'

type SummaryProps = {
  cart: {
    items?: CartItems
    createdOn?: string | null
    lastModified?: string | null
  }
}

export function CartSummary({ cart }: SummaryProps) {
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
