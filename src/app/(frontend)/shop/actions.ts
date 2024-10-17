import { notFound } from 'next/navigation'
import getPayload from '@lib/utils/getPayload'
import {
  PRODUCT_SLUG,
  SHOP_COLLECTION_SLUG,
  PRODUCT_CATEGORY_SLUG,
} from '@payload/collections/constants'
import type { Product } from '@payload-types'

export async function getCollectionProducts(collectionSlug: string): Promise<Product[]> {
  const payload = await getPayload()

  try {
    const collection = await payload.find({
      collection: SHOP_COLLECTION_SLUG,
      where: {
        slug: {
          equals: collectionSlug,
        },
      },
    })

    if (!collection.docs.length) {
      notFound()
    }

    const products = await payload.find({
      collection: PRODUCT_SLUG,
      where: {
        collections: {
          contains: collection.docs[0].id,
        },
      },
    })

    return products.docs
  } catch (error) {
    console.error('Error fetching collection products:', error)
    return []
  }
}

export async function getCategoryProducts(categorySlug: string): Promise<Product[]> {
  const payload = await getPayload()

  try {
    const category = await payload.find({
      collection: PRODUCT_CATEGORY_SLUG,
      where: {
        slug: {
          equals: categorySlug,
        },
      },
    })

    if (!category.docs.length) {
      notFound()
    }

    const products = await payload.find({
      collection: PRODUCT_SLUG,
      where: {
        categories: {
          contains: category.docs[0].id,
        },
      },
    })

    return products.docs
  } catch (error) {
    console.error('Error fetching category products:', error)
    return []
  }
}

export async function getProduct(productSlug: string): Promise<Product | null> {
  const payload = await getPayload()

  try {
    const product = await payload.find({
      collection: PRODUCT_SLUG,
      where: {
        slug: {
          equals: productSlug,
        },
      },
    })

    return product.docs[0]
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const payload = await getPayload()

  try {
    const products = await payload.find({
      collection: PRODUCT_SLUG,
    })

    return products.docs
  } catch (error) {
    console.error('Error fetching all products:', error)
    return []
  }
}
