import React from 'react'

import type { ProductCollection, ProductCategory } from 'src/payload-types'
import RichText from '@/components/layout/rich-text'
import type { ArchiveBlockProps } from './types'
import getPayload from '@/lib/utils/getPayload'
import { PRODUCT_CATEGORY_SLUG, PRODUCT_COLLECTION_SLUG } from '@/payload/collections/constants'
import ProductCollectionCard from '@/components/shop/layout/cards/product-collection-card'
import ProductCategoryCard from '@/components/shop/layout/cards/product-category-card'

export const ProductArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    introContent,
    middleContent,
    showProductCollectionsFirst,
    limit = 3,
    populateBy,
    selectedDocs,
    relationTo,
  } = props

  let productCollections: ProductCollection[] = []
  let productCategories: ProductCategory[] = []

  const payload = await getPayload()

  if (populateBy === 'collection') {
    if (relationTo === 'product-collections') {
      const collections = await payload.find({
        collection: PRODUCT_COLLECTION_SLUG,
        limit: limit ?? undefined,
      })
      productCollections = collections.docs
    }

    if (relationTo === 'product-categories') {
      const categories = await payload.find({
        collection: PRODUCT_CATEGORY_SLUG,
        limit: limit ?? undefined,
      })

      productCategories = categories.docs
    }
  } else {
    if (
      selectedDocs &&
      selectedDocs.length > 0 &&
      selectedDocs.every((doc) => typeof doc.value === 'object')
    ) {
      selectedDocs.forEach((doc) => {
        if (
          doc.relationTo === PRODUCT_COLLECTION_SLUG &&
          typeof doc.value === 'object' &&
          doc.value !== null
        ) {
          productCollections.push(doc.value as ProductCollection)
        }

        if (
          doc.relationTo === PRODUCT_CATEGORY_SLUG &&
          typeof doc.value === 'object' &&
          doc.value !== null
        ) {
          productCategories.push(doc.value as ProductCategory)
        }
      })
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ml-0 max-w-[48rem]" content={introContent} enableGutter={false} />
        </div>
      )}
      {showProductCollectionsFirst ? (
        <>
          {productCollections.length > 0 && (
            <div className="container mb-16">
              <h2 className="mb-8 text-3xl font-bold">Product Collections</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {productCollections.map((collection) => (
                  <ProductCollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          )}
          {middleContent && (
            <div className="container mb-16">
              <RichText content={middleContent} />
            </div>
          )}
          {productCategories.length > 0 && (
            <div className="container">
              <h2 className="mb-8 text-3xl font-bold">Product Categories</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {productCategories.map((category) => (
                  <ProductCategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {productCategories.length > 0 && (
            <div className="container mb-16">
              <h2 className="mb-8 text-3xl font-bold">Product Categories</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {productCategories.map((category) => (
                  <ProductCategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
          )}
          {middleContent && (
            <div className="container mb-16">
              <RichText content={middleContent} />
            </div>
          )}
          {productCollections.length > 0 && (
            <div className="container">
              <h2 className="mb-8 text-3xl font-bold">Product Collections</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {productCollections.map((collection) => (
                  <ProductCollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
