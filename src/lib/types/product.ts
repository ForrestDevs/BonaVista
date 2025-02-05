import { ProductVariant } from '@payload-types'

export type Variant = Exclude<NonNullable<ProductVariant>[number], null>

export type VariantInfo = {
  info: {
    options: Array<{
      label: string
      id: string
    }>
  }
}

export type EnhancedProductVariant = Omit<ProductVariant[number], 'info'> & {
  info: {
    options: Array<{
      label: string
      id: string
      slug: string
      key: {
        slug: string
        label: string
      }
    }>
  }
}
