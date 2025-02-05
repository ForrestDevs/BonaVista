'use server'

import { actionClient } from '@/lib/actions/client'
import { z } from 'zod'
import { deleteCartItem, getOrSetCart, updateCartItemQuantity } from '../data/cart'

const schema = z.object({
  quantity: z.number(),
  cartItemId: z.string(),
  path: z.optional(z.string()),
})

export const updateCartItemQuantityAction = actionClient
  .metadata({ actionName: 'updateCartItemQuantity' })
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { quantity, cartItemId } = parsedInput

    const result = await updateCartItemQuantity(quantity, cartItemId)

    if (!result) {
      throw new Error('Error updating cart item quantity')
    }

    return {
      newQuantity: quantity,
    }
  })

export const deleteCartItemAction = actionClient
  .metadata({ actionName: 'deleteCartItem' })
  .schema(z.object({ cartItemId: z.string() }))
  .action(async ({ parsedInput }) => {
    const { cartItemId } = parsedInput
    try {
      await deleteCartItem({ cartItemId })
      return {
        cartItemId,
      }
    } catch (error) {
      console.error('Error deleting cart item', error)
      return {
        error: 'Error deleting cart item',
      }
    }
  })
