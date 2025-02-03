import type { Product } from '@payload-types'

// Ensure Product type has the correct structure
export type EnsuredProduct = Product & {
  variants: {
    options: { label: string; slug: string; values: { label: string; slug: string }[] }[]
    variants: any[] // Adjust this type if needed
  }
}

export type OptionKey = EnsuredProduct['variants']['options'][number]
export type Option = OptionKey['values'][number]
export type ProductVariant = EnsuredProduct['variants']['variantProducts'][number]

export type KeysFieldValue = {
  options: (Option & { key: OptionKey })[]
}

export interface RadioGroupProps {
  /**
   * Required for sorting the array
   */
  fullArray: EnsuredProduct['variants']['options']
  group: OptionKey
  options: Option[]
  path: string
  setValue: (value: string[]) => void
  value: string[]
}

export type InfoType = {
  options: {
    key: {
      label: OptionKey['label']
      slug: OptionKey['slug']
    }
    label: Option['label']
    slug: Option['slug']
  }[]
  price: {
    amount: number
    currency: string
  }
  productName: string
  stock: number
}
