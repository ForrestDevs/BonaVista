import React from 'react'
import Grid from '@components/payload/grid'
import type { Product } from '@payload-types'
import { ProductCard } from './products/product-card'

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <React.Fragment>
      {products.map((product) => (
        <Grid.Item className="animate-fadeIn" key={product.id}>
          <ProductCard product={product} />
        </Grid.Item>
      ))}
    </React.Fragment>
  )
}
