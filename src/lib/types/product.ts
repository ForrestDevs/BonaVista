import { ProductVariant } from '@payload-types'

export type Variant = Exclude<NonNullable<ProductVariant>[number], null>
