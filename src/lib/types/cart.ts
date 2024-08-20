import type { Product } from '@payload-types'
import type { ProductVariant } from '@/lib/types/product'
import type { CartItems } from '@payload-types'

export type CartItem = Exclude<NonNullable<CartItems>[number], null> & {
  variant?: ProductVariant
}

export type CartType =
  | { items?: CartItem[]; createdOn?: string | null; lastModified?: string | null }
  | undefined

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
      payload: { product: Product; variantId?: string }
      type: 'DELETE_ITEM'
    }
  | {
      type: 'CLEAR_CART'
    }

export type CartTotalState = {
  formatted: string
  raw: number
}
