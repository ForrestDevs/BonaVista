import type { User } from '@payload-types'
import { CartItem } from '@/lib/types/cart'

export const arrayHasItems = (array: any) => Array.isArray(array) && array.length > 0

/**
 * ensure that cart items are fully populated, filter out any items that are not
 * this will prevent discontinued products from appearing in the cart
 */
export const flattenCart = (cart: User['cart']): User['cart'] => ({
  ...cart,
  items: cart?.items
    ?.filter(Boolean)
    .map((item) => {
      if (!item?.product || typeof item?.product !== 'object') {
        return null
      }

      return {
        ...item,
        // flatten relationship to product
        product: item?.product?.id,
        quantity: typeof item?.quantity === 'number' ? item?.quantity : 0,
      }
    })
    .filter(Boolean) as CartItem[],
})
