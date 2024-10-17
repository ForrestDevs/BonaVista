'use client'

import React from 'react'
import { Cart, Order } from '@payload-types'
import { Info } from 'lucide-react'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'

export function CartTotals({ cart }: { cart: Cart }) {
  const { subtotal, discount_total, tax_total, shipping_total, total } = cart

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            Subtotal
            {/* <TooltipProvider>
              <TooltipTrigger>
                <Info color="var(--fg-muted)" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Cart total excluding shipping and taxes.</p>
              </TooltipContent>
            </TooltipProvider> */}
          </span>
          <span data-testid="cart-subtotal" data-value={subtotal || 0}>
            {/* {getAmount(subtotal)} */}
          </span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              {/* - {getAmount(discount_total)} */}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span data-testid="cart-shipping" data-value={shipping_total || 0}>
            {/* {getAmount(shipping_total)} */}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Taxes</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {/* {getAmount(tax_total)} */}
          </span>
        </div>
      </div>
      <div className="h-px w-full border-b border-muted my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>Total</span>
        <span className="txt-xlarge-plus" data-testid="cart-total" data-value={total || 0}>
          {/* {getAmount(total)} */}
        </span>
      </div>
      <div className="h-px w-full border-b border-muted mt-4" />
    </div>
  )
}
