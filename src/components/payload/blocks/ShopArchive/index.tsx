import React from 'react'
import RichText from '@components/payload/RichText'
import getPayload from '@lib/utils/getPayload'
import type {
  ShopCollection,
  ProductCategory,
  ShopArchiveBlock as ShopArchiveBlockType,
} from '@payload-types'
import ProductCategoryCard from '@components/shop/layout/cards/product-category-card'
import ProductCollectionCard from '@components/shop/layout/cards/product-collection-card'
import { PRODUCT_CATEGORY_SLUG, SHOP_COLLECTION_SLUG } from '@payload/collections/constants'

export const ShopArchiveBlock: React.FC<
  ShopArchiveBlockType & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    introContent,
    populateBy,
    productCategories,
    productCollections,
    showAllCollections,
  } = props

  let productCollectionsShown: ShopCollection[] = []
  let productCategoriesShown: ProductCategory[] = []

  const payload = await getPayload()

  if (populateBy === SHOP_COLLECTION_SLUG) {
    if (showAllCollections) {
      const collections = await payload.find({
        collection: SHOP_COLLECTION_SLUG,
      })
      productCollectionsShown = collections.docs
    } else {
      if (
        productCollections &&
        productCollections.length > 0 &&
        productCollections.every((collection) => typeof collection === 'object')
      ) {
        productCollectionsShown = productCollections
      } else if (
        productCollections &&
        productCollections.length > 0 &&
        productCollections.every((collection) => typeof collection === 'string')
      ) {
        const collections = await payload.find({
          collection: SHOP_COLLECTION_SLUG,
          where: {
            id: {
              equals: productCollections,
            },
          },
        })
        productCollectionsShown = collections.docs
      }
    }
  } else if (populateBy === PRODUCT_CATEGORY_SLUG) {
    if (showAllCollections) {
      const categories = await payload.find({
        collection: PRODUCT_CATEGORY_SLUG,
      })
      productCategoriesShown = categories.docs
    } else {
      if (
        productCategories &&
        productCategories.length > 0 &&
        productCategories.every((category) => typeof category === 'object')
      ) {
        productCategoriesShown = productCategories
      } else if (
        productCategories &&
        productCategories.length > 0 &&
        productCategories.every((category) => typeof category === 'string')
      ) {
        const categories = await payload.find({
          collection: PRODUCT_CATEGORY_SLUG,
          where: {
            id: {
              equals: productCategories,
            },
          },
        })
        productCategoriesShown = categories.docs
      }
    }
  }

  return (
    <div id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ml-0 max-w-[48rem]" content={introContent} enableGutter={false} />
        </div>
      )}
      {productCollectionsShown.length > 0 && (
        <div className="container mb-16">
          <h2 className="mb-8 text-3xl font-bold">Product Collections</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {productCollectionsShown.map((collection) => (
              <ProductCollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      )}
      {productCategoriesShown.length > 0 && (
        <div className="container mb-16">
          <h2 className="mb-8 text-3xl font-bold">Product Categories</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {productCategoriesShown.map((category) => (
              <ProductCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
