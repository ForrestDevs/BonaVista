import { createContext, useContext } from 'react'
import type { Product, User } from '@payload-types'
import { CartItem } from '@/lib/types/cart'

export type CartContextProps = {
  addItemToCart: (item: CartItem) => void
  cart: User['cart']
  cartIsEmpty: boolean | undefined
  cartTotal: {
    formatted: string
    raw: number
  }
  clearCart: () => void
  deleteItemFromCart: (product: Product) => void
  hasInitializedCart: boolean
  isProductInCart: (product: Product) => boolean
}

export const CartContext = createContext({} as CartContextProps)
