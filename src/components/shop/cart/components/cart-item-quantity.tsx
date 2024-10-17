'use client'

import React, { startTransition, useOptimistic, useState } from 'react'
import { Button } from '@components/ui/button'
import type { CartItem } from '@lib/types/cart'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { decreaseCartItemQuantity, increaseCartItemQuantity } from '@lib/data/cart'

interface CartItemQuantityProps {
  item: CartItem
}

export function CartItemQuantity({ item }: CartItemQuantityProps) {
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic<number, number>(
    item.quantity,
    (state, payload) => {
      if (payload === 1) {
        return state + payload
      } else if (payload === -1) {
        if (state > 1) {
          return state + payload
        }
        return state
      }
    },
  )

  const handleDecreaseQuantity = () => {
    setOptimisticQuantity(-1)
    decreaseCartItemQuantity(item.id)
  }

  const handleIncreaseQuantity = () => {
    setOptimisticQuantity(1)
    increaseCartItemQuantity(item.id, 1)
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => startTransition(() => handleDecreaseQuantity())}
        aria-label="Decrease quantity"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center">{optimisticQuantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => startTransition(() => handleIncreaseQuantity())}
        aria-label="Increase quantity"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
