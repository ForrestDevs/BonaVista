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
