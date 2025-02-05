'use client'

import { CartItem } from '@/lib/types/cart'
import { CartItemRow } from './cart-item-row'
import { AnimatePresence } from 'framer-motion'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { deleteCartItemAction } from '@/lib/actions/cart'

interface CartItemListProps {
  items: CartItem[]
}

export function CartItemList({ items }: CartItemListProps) {
  const { execute, result, optimisticState, isExecuting } = useOptimisticAction(
    deleteCartItemAction,
    {
      currentState: { items }, // gets passed from Server Component
      updateFn: (state, newItems) => {
        return {
          items: state.items.filter((item) => item.id !== newItems.cartItemId),
        }
      },
    },
  )

  if (items.length === 0) {
    return <p className="text-center text-gray-500">Your cart is empty.</p>
  }

  return (
    <ul role="list" className="flex-1 overflow-y-auto px-4 py-6 sm:px-4">
      <AnimatePresence initial={false}>
        {optimisticState.items.map((line, index) => (
          <CartItemRow
            key={line.id}
            line={line}
            index={index}
            deleteCartItemCallback={execute}
            length={optimisticState.items.length}
          />
        ))}
      </AnimatePresence>
    </ul>
  )
}
