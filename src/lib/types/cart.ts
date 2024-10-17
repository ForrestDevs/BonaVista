import type { CartItems, Cart, Address } from '@payload-types'

export type CartItem = Exclude<NonNullable<CartItems>[number], null>

export type CartAction =
  | {
      payload: CartItem
      type: 'ADD_ITEM'
    }
  | {
      payload: Cart
      type: 'MERGE_CART'
    }
  | {
      payload: Cart
      type: 'SET_CART'
    }
  | {
      payload: string
      type: 'DECREMENT_QUANTITY'
    }
  | {
      payload: string
      type: 'DELETE_ITEM'
    }
  | {
      payload: string
      type: 'INCREMENT_QUANTITY'
    }
  | {
      payload: Address
      type: 'SET_SHIPPING_ADDRESS'
    }
  | {
      payload: Address
      type: 'SET_BILLING_ADDRESS'
    }
  | {
      type: 'CLEAR_CART'
    }

export type CartTotalState = {
  formatted: string
  raw: number
}
