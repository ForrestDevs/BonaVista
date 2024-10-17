import React from 'react'
import { Separator } from '@components/ui/separator'
// import { fetchCart } from '@lib/data/cart'
import { CartTotals } from '@components/shop/cart/components/cart-totals'
import { CartPreview } from '@components/shop/cart/components/cart-preview'

// import DiscountCode from '@modules/checkout/components/discount-code'

export async function CheckoutSummary() {
  // const cart = await fetchCart()

  return (
    <div className="sticky top-0 flex flex-col-reverse lg:flex-col gap-y-8 py-8 lg:py-0 ">
      <div className="w-full bg-background flex flex-col">
        {/* <Separator className="my-6 small:hidden" /> */}
        <h2 className="flex flex-row text-3xl items-baseline">In your Cart</h2>
        <Separator className="my-6 bg-muted" />
        {/* <CartTotals cart={cart} />
        <CartPreview items={cart?.items} /> */}
        {/* <div className="my-6">
          <DiscountCode cart={cart} />
        </div> */}
      </div>
    </div>
  )
}
