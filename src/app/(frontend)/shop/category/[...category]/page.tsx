import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import getPayload from '@/lib/utils/getPayload'
import { PRODUCT_CATEGORY_SLUG } from '@/payload/collections/constants'
import { ProductCategory } from '@payload-types'
import { Blocks } from '@/components/layout/blocks/render'
import { getCachedDocument } from '@/lib/utils/getDocument'
import type { Product } from '@payload-types'
import { ProductCard } from '@/components/shop/products/product-card'
import { getCategoryProducts } from '../../actions'

type Props = {
  params: { category: string[] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCachedDocument<typeof PRODUCT_CATEGORY_SLUG>(
    PRODUCT_CATEGORY_SLUG,
    params.category[params.category.length - 1],
  )

  if (!category) {
    notFound()
  }

  return {
    title: `${category.title} | BonaVista Leisurescapes`,
    description: category.description || `${category.title} category`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCachedDocument<typeof PRODUCT_CATEGORY_SLUG>(
    PRODUCT_CATEGORY_SLUG,
    params.category[params.category.length - 1],
    1,
  )

  if (!category) {
    notFound()
  }

  const products = await getCategoryProducts(params.category[params.category.length - 1])

  return (
    <>
      <h1>{category.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
