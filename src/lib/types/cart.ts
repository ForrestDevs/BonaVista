import type { Product, User, CartItems } from '@payload-types'

export type CartItem = Exclude<NonNullable<CartItems>[number], null>

export type CartType = User['cart']

export type CartAction =
  | {
      payload: CartItem
      type: 'ADD_ITEM'
    }
  | {
      payload: CartType
      type: 'MERGE_CART'
    }
  | {
      payload: CartType
      type: 'SET_CART'
    }
  | {
      payload: Product
      type: 'DELETE_ITEM'
    }
  | {
      type: 'CLEAR_CART'
    }


export type CartTotalState = {
  formatted: string
  raw: number
}

