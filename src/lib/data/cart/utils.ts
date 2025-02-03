import { CartItem } from '@/lib/types/cart'
import { Cart } from '@payload-types'

//   return cart.lines.reduce(
//     (total, { product, quantity }) => total + (product.default_price?.unit_amount ?? 0) * quantity,
//     0,
//   )
// }

export const calculateCartTotalNetWithoutShipping = (cart: Cart) => {
  if (!cart) {
    return 0
  }

  return cart.items.reduce((total, item) => {
    const productPrice = item.price ?? 0
    return total + productPrice * item.quantity
  }, 0)
}

export const calculateCartTotalPossiblyWithTax = (cart: Cart) => {
  if (!cart) {
    return 0
  }

  if (cart.taxCalculationId) {
    return cart.tax_total
  }

  return (cart.shipping_total ?? 0) + calculateCartTotalNetWithoutShipping(cart)
}
