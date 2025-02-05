'use server'

import { actionClient } from '@/lib/actions/client'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { deleteCartItem, getOrSetCart, updateCartItemQuantity } from '../data/cart'
import getPayload from '@/lib/utils/getPayload'
import { CART_SLUG } from '@/payload/collections/constants'

// const schema = z.object({
//   id: z.string().uuid(),
//   body: z.string().min(1),
//   completed: z.boolean(),
// })

// export type Todo = z.infer<typeof schema>

// let todos: Todo[] = []
// export const getTodos = async () => todos

// export const addTodo = actionClient
//   .metadata({ actionName: '' })
//   .schema(schema)
//   .action(async ({ parsedInput }) => {
//     await new Promise((res) => setTimeout(res, 500))

//     todos.push(parsedInput)

//     // This Next.js function revalidates the provided path.
//     // More info here: https://nextjs.org/docs/app/api-reference/functions/revalidatePath
//     revalidatePath('/optimistic-hook')

//     return {
//       createdTodo: parsedInput,
//     }
//   })

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
