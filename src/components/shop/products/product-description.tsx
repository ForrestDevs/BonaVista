import type { Product } from '@payload-types'
import type { InfoType } from 'src/payload/collections/Products/ui/types'

import RichText from '@components/payload/RichText'
import { AddToCart } from '@components/shop/add-to-cart'
import Price from '@components/shop/price'
// import Prose from '@/components/prose'
import React, { Suspense } from 'react'

import { VariantSelector } from './variant-selector'

export function ProductDescription({ product }: { product: Product }) {
  let amount = 0,
    lowestAmount = 0,
    highestAmount = 0,
    currency = 'CAD'

  const hasVariants = product.enableVariants && product.variants?.variantProducts?.length

  if (hasVariants) {
    const variantsOrderedByPrice = product.variants.variantProducts.sort((a, b) => {
      // const aInfo = a.info as InfoType
      // const bInfo = b.info as InfoType
      return a.price - b.price
    })

    lowestAmount = variantsOrderedByPrice[0].price
    highestAmount = variantsOrderedByPrice[variantsOrderedByPrice.length - 1].price
  } else if (product.baseProduct) {
    // const info = product.baseProduct.info as InfoType
    amount = product.baseProduct.price
    currency = 'CAD'
  }

  return (
    <React.Fragment>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          {hasVariants ? (
            <Price
              currencyCode={currency}
              highestAmount={highestAmount}
              lowestAmount={lowestAmount}
            />
          ) : (
            <Price amount={amount} currencyCode={currency} />
          )}
        </div>
      </div>
      <Suspense fallback={null}>
        <VariantSelector product={product} />
      </Suspense>

      {product.description ? (
        <RichText className="mb-6" content={product.description} enableGutter={false} />
      ) : null}

      <Suspense fallback={null}>
        <AddToCart product={product} variants={product.variants.variantProducts} />
      </Suspense>
    </React.Fragment>
  )
}
