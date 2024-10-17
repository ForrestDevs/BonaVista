import React from 'react'

import { cn } from '@/lib/utils/cn'
import type { Product } from '@/payload-types'
import RichText from '@components/payload/RichText'
import getPayload from '@/lib/utils/getPayload'
// import { ProductCard } from '@components/shop/products/product-card'

export type RelatedProductsProps = {
  className?: string
  docs?: (string | Product)[]
  introContent?: any
}

export const RelatedProducts: React.FC<RelatedProductsProps> = async (props) => {
  const { className, docs, introContent } = props
  const payload = await getPayload()

  let products: Product[] = []

  if (docs) {
    const res = await Promise.all(
      docs.map(async (doc) => {
        if (typeof doc === 'string') {
          try {
            const fetchedProduct = await payload.findByID({
              collection: 'products',
              id: doc,
              depth: 0,
            })
            return fetchedProduct as Product
          } catch (error) {
            console.error(`Error fetching product with id ${doc}:`, error)
            return null
          }
        } else if (typeof doc === 'object' && doc !== null) {
          return doc as Product
        } else {
          console.error(`Invalid doc type: ${typeof doc}`)
          return null
        }
      }),
    )
    products = res.filter((product): product is Product => product !== null)
  } else {
    products = []
  }

  return (
    <div className={cn('container', className)}>
      {introContent && <RichText content={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 items-stretch">
        {products.map((product, index) => (
          <div key={index}>{product.title}</div>
          // <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  )
}
