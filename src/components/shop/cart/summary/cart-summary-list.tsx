'use client'

import { CartItem } from '@/lib/types/cart'
import { AnimatePresence } from 'framer-motion'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { deleteCartItemAction } from '@/lib/actions/cart'
import { CartSummaryRow } from './cart-summary-row'
import { CartSummaryTotals } from './cart-summary-totals'

interface CartSummaryListProps {
  items: CartItem[]
}

export function CartSummaryList({ items }: CartSummaryListProps) {
  const { execute, optimisticState } = useOptimisticAction(deleteCartItemAction, {
    currentState: { items },
    updateFn: (state, newItems) => {
      return {
        items: state.items.filter((item) => item.id !== newItems.cartItemId),
      }
    },
  })

  if (items.length === 0) {
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
      <CartSummaryTotals items={optimisticState.items} />
    </div>
  )
}
