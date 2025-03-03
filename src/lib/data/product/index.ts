'use server'

import { Product } from '@payload-types'
import { PRODUCT_SLUG } from '@payload/collections/constants'
import getPayload from '@lib/utils/getPayload'

export async function getProduct(productId: number): Promise<Product | null> {
  const payload = await getPayload()

  try {
    const product = await payload.findByID({
      collection: PRODUCT_SLUG,
      id: productId,
      depth: 1,
    })
    return product
  } catch (error) {
    console.error(error)
    return null
  }
}
