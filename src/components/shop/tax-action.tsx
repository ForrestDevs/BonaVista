'use server'

import { getCart } from '@/lib/data/cart'
// import * as Commerce from 'commerce-kit'

export const saveTaxIdAction = async ({ taxId }: { taxId: string }) => {
  const cart = await getCart()
  if (!cart) {
    throw new Error('No cart id found in cookies')
  }

//   await Commerce.cartSaveTax({ cartId: cart.cart.id, taxId })
}
