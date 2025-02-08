'use client'

import { AnimatePresence } from 'motion/react'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { deleteCartItemAction } from '@/lib/actions/cart'
import { CartSummaryRow } from './cart-summary-row'
import { useCart } from './cart-summary-context'
import { Cart } from '@payload-types'

interface CartSummaryListProps {
  cart: Cart
}

export function CartSummaryList({ cart }: CartSummaryListProps) {
  const { setIsUpdating } = useCart()
  const { execute, optimisticState } = useOptimisticAction(deleteCartItemAction, {
    currentState: { items: cart.items },
    updateFn: (state, newItems) => {
      const updatedItems = state.items.filter((item) => item.id !== newItems.cartItemId)
      return {
        items: updatedItems,
      }
    },
    onSuccess: () => {
      setIsUpdating(false)
    },
  })

  if (cart.items.length === 0) {
    return <p className="text-center text-gray-500">Your cart is empty.</p>
  }

  return (
    <div className="space-y-6">
      <ul role="list" className="divide-y divide-neutral-100">
        <AnimatePresence initial={false}>
          {optimisticState.items.map((line, index) => (
            <CartSummaryRow
              key={line.id}
              line={line}
              index={index}
              deleteCartItemCallback={execute}
              length={optimisticState.items.length}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
