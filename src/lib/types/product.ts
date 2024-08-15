import { ProductVariants } from '@payload-types'

export type ProductVariant = Exclude<NonNullable<ProductVariants>[number], null>
