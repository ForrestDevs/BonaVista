import type { LineItems, Cart } from '@payload-types'

export type CartItem = Exclude<NonNullable<LineItems>[number], null>

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
      type: 'CLEAR_CART'
    }

export type CartTotalState = {
  formatted: string
  raw: number
}
