'use client'

import { useCart } from '@/lib/providers/Cart'

export function CartTooltipData() {
  const { cart, cartTotal } = useCart()

  const totalItems = cart?.items?.reduce((acc, item) => acc + (item.quantity ?? 0), 0)

  return (
    <div className="flex flex-col items-start">
      <p className="text-sm font-medium">
        {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
      </p>
      <p className="text-sm font-bold">Total: {cartTotal.formatted}</p>
    </div>
  )
}

export function CartBadge() {
  const { cart, cartTotal } = useCart()
  const totalItems = cart?.items?.reduce((acc, item) => acc + (item.quantity ?? 0), 0)

  return (
    <>
      {totalItems && totalItems > 0 && (
        <span className="absolute bottom-0 right-0 inline-flex h-5 w-5 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 bg-white text-center text-xs">
          <span className="sr-only">Items in cart: {totalItems}</span>
          <span>{totalItems}</span>
          <span className="sr-only">Total: {cartTotal.formatted}</span>
        </span>
      )}
    </>
  )
}
