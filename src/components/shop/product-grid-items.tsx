import type { Product } from '@payload-types'

import Grid from '@components/payload/grid'
import { GridTileImage } from '@components/payload/grid/tile'
import Link from 'next/link'
import React from 'react'

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <React.Fragment>
      {products.map((product) => {
        const image =
          typeof product.gallery?.[0]?.image !== 'string' ? product.gallery?.[0]?.image : undefined
        const hasVariants = product.enableVariants

        const price = hasVariants
          ? product.variants.variantProducts[0].price
          : product.baseProduct.price

        if (!image) return null
        return (
          <Grid.Item className="animate-fadeIn" key={product.id}>
            <Link className="relative inline-block h-full w-full" href={`/shop/product/${product.slug}`}>
              <GridTileImage
                label={{
                  amount: price,
                  currencyCode: 'USD',
                  title: product.title,
                }}
                media={image}
              />
            </Link>
          </Grid.Item>
        )
      })}
    </React.Fragment>
  )
}
