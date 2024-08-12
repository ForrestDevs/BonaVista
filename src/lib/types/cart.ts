import type { Product, User } from '@payload-types'

export type CartItem = {
  product?: (string | null) | Product
  quantity?: number | null
  id?: string | null
}

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

