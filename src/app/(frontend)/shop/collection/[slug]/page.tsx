import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import getPayload from '@/lib/utils/getPayload'
import { PRODUCT_COLLECTION_SLUG } from '@/payload/collections/constants'
import { ProductCollection } from '@payload-types'
import { Blocks } from '@/components/layout/blocks/render'
import { getCachedDocument } from '@/lib/utils/getDocument'
import type { Product } from '@payload-types'
// import { ProductCard } from '@/components/shop/products/product-card'
import { getCollectionProducts } from '../../actions'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCachedDocument<typeof PRODUCT_COLLECTION_SLUG>(
    PRODUCT_COLLECTION_SLUG,
    params.slug,
  )

  if (!collection) {
    notFound()
  }

  return {
    title: `${collection.title} | BonaVista Leisurescapes`,
    description: collection.description || `${collection.title} collection`,
  }
}

export default async function CollectionPage({ params }: Props) {
  const collection = await getCachedDocument<typeof PRODUCT_COLLECTION_SLUG>(
    PRODUCT_COLLECTION_SLUG,
    params.slug,
    1,
  )

  if (!collection) {
    notFound()
  }

  const products = await getCollectionProducts(params.slug)

  console.log(products)

  return (
    <>
      <h1>{collection.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id}>{product.title}</div>
          // <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
