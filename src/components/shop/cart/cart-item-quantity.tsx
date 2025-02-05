'use client'

import { Button } from '@/components/ui/button'
import { SelectItem } from '@/components/ui/select'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CartItem } from '@/lib/types/cart'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { Trash2 } from 'lucide-react'
import { deleteCartItem } from '@/lib/data/cart'
import { updateCartItemQuantityAction } from '@/lib/actions/cart'
import { useState } from 'react'
// import { updateCartItemQuantity } from '@/lib/data/cart'

export function CartItemQuantity({ item }: { item: CartItem }) {
  const quantity = item.quantity
  const [isDeleting, setIsDeleting] = useState(false)

  const { execute, result, optimisticState, isExecuting } = useOptimisticAction(
    updateCartItemQuantityAction,
    {
      currentState: { quantity }, // gets passed from Server Component
      updateFn: (state, newQuantity) => {
        return {
          quantity: newQuantity.quantity,
        }
      },
    },
  )

  const handleRemoveItem = async (itemId: string) => {
    setIsDeleting(true)
    await deleteCartItem({ cartItemId: itemId })
    setIsDeleting(false)
  }

  //   const updateQuantity = async (itemId: string, quantity: number) => {
  //     await updateCartItemQuantity(quantity, itemId)
  //   }

  return (
    <div className="flex gap-2 items-center w-28">
      <div className="flex items-center justify-between text-sm">
        <Button
          size="icon"
          variant="none"
          className="text-muted-foreground hover:text-black"
          onClick={() => handleRemoveItem(item.id)}
          disabled={isExecuting}
        >
          <Trash2 className="h-4 w-4 " />
        </Button>
      </div>

      <Select
        value={optimisticState.quantity.toString()}
        onValueChange={(value) =>
          execute({ quantity: parseInt(value), cartItemId: item.id, path: '/shop/cart' })
        }
        disabled={isExecuting}
      >
        <SelectTrigger className="">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
