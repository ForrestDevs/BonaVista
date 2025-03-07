import type { CollectionAfterDeleteHook } from 'payload'

import type { Product } from '@/payload-types'

export const deleteProductFromCarts: CollectionAfterDeleteHook<Product> = async ({ id, req }) => {
  const cartsWithProductInCart = await req.payload.find({
    collection: 'cart',
    overrideAccess: true,
    where: {
      'items.product': {
        equals: id,
      },
    },
  })

  if (cartsWithProductInCart.totalDocs > 0) {
    await Promise.all(
      cartsWithProductInCart.docs.map(async (cart) => {
        if (cart?.lineItems?.length) {
          const itemsWithoutProduct = cart.lineItems.filter((item) => item.lineItem.product !== id)

          return req.payload.update({
            id: cart.id,
            collection: 'cart',
            data: {
              lineItems: itemsWithoutProduct,
            },
          })
        }
      }),
    )
  }
}
