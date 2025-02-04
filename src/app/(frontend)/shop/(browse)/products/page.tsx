import getPayload from '@lib/utils/getPayload'
import { PRODUCT_SLUG } from '@payload/collections/constants'
import { ProductCard } from '@/components/shop/products/product-card'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Products | BonaVista Leisurescapes',
  description: 'Browse our complete collection of pool and spa care products',
}

export default async function ProductsPage() {
  const payload = await getPayload()

  const { docs: products } = await payload.find({
    collection: PRODUCT_SLUG,
    limit: 100,
    depth: 1,
  })

  const amaze = await payload.findByID({
    collection: PRODUCT_SLUG,
    id: '67a1d872f69929cf5c183c32',
    depth: 1,
  })

  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {/* <ProductCard key={amaze.id} product={amaze} /> */}
      </div>
    </div>
  )
}
