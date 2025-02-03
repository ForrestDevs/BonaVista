'use server'

import { actionClient } from '@/lib/actions/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getOrSetCart } from '../data/cart'
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

export const updateCartItemQuantity = actionClient
  .metadata({ actionName: 'updateCartItemQuantity' })
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { quantity, cartItemId, path } = parsedInput

    console.log('updating cart item quantity', quantity, cartItemId)
    const payload = await getPayload()
    const cart = await getOrSetCart() // Get the current cart

    if (!cart) {
      throw new Error('Error retrieving or creating cart')
    }

    const updatedCartItems = cart.items.map((item) => {
      if (item.id === cartItemId) {
        return { ...item, quantity }
      }
      return item
    })

    const updatedCart = await payload.update({
      collection: CART_SLUG,
      id: cart.id,
      data: {
        items: updatedCartItems,
      },
    })

    console.log('updatedCart', updatedCart)

    if (path) {
      revalidatePath(path)
    }

    return {
      newQuantity: quantity,
    }
  })
