import React from 'react'
import type { Metadata } from 'next'
import { getCachedDocument } from '@lib/utils/getDocument'
import { PRODUCT_SLUG } from '@payload/collections/constants'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/shop/products/product-card'
import RichText from '@/components/payload/RichText'
import Link from 'next/link'
import { ProductProvider } from './context/product-context'
import { VariantSelector } from './components/variant-selector'
import { ProductGallery } from './components/product-gallery'
import { AddToCartButton } from './components/add-to-cart-button'
import { ProductPrice } from './components/product-price'
import { Gallery } from '@/components/shop/products/gallery'
import ProductBreadcrumb from './components/product-breadcrumb'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getCachedDocument<typeof PRODUCT_SLUG>(PRODUCT_SLUG, slug)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | BonaVista Leisurescapes`,
    description: product.description,
  }
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params
  const product = await getCachedDocument<typeof PRODUCT_SLUG>(PRODUCT_SLUG, slug, 2)

  if (!product) {
    notFound()
  }

  const brands = product.brand?.map((brand) => (typeof brand === 'string' ? brand : brand.name))
  const price = product.enableVariants
    ? product.variants.variantProducts[0].price
    : product.baseProduct.price
  const image = product.enableVariants
    ? product.variants.variantProducts[0].images[0].image
    : product.baseProduct.images[0].image

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: image,
    offers: {
      '@type': 'AggregateOffer',
      //   availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: price,
      priceCurrency: 'CAD',
    },
  }

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <ProductProvider product={product}>
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <ProductBreadcrumb product={product} searchParams={{ from: '' }} />

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
            {/* Left Column - Gallery & Details */}
            <div className="lg:col-span-8 order-2 lg:order-1">
              <div className="space-y-8">
                <Gallery />
                {/* <ProductGallery /> */}

                {/* Product Details Tabs */}
                <div className="border-t border-gray-200">
                  <div className="space-y-8 py-6">
                    <div>
                      <h3 className="text-lg font-medium">Description</h3>
                      <RichText content={product.moreInfo} />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Specifications</h3>
                      <div className="mt-4 prose prose-sm max-w-none">
                        {product.baseProduct.sku}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Purchase Info */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="top-8">
                <div className="mt-8 lg:mt-0">
                  <h1 className="text-2xl font-bold">{product.title}</h1>

                  {product.brand && (
                    <div className="mt-2">
                      <span className="text-gray-600">Brand: </span>
                      <span className="font-medium">{brands.join(', ')}</span>
                    </div>
                  )}

                  <h2 className="text-xl font-medium">{product.description}</h2>

                  <ProductPrice />
                  <VariantSelector />

                  <div className="mt-6">
                    <AddToCartButton />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {product.relatedProducts.map(
                  (relatedProduct) =>
                    typeof relatedProduct !== 'string' && (
                      <ProductCard key={relatedProduct.id} product={relatedProduct} />
                    ),
                )}
              </div>
            </div>
          )}
        </div>
      </ProductProvider>
    </React.Fragment>
  )
}

// const getProductDTO = (product: Product) => {
//   const enableVariants = product.enableVariants
//   const hasVariants = enableVariants && (product?.variants?.variantProducts?.length ?? 0) > 1
//   const variantOptions = enableVariants ? product.variants.options : []
//   const variantProducts = enableVariants ? product.variants.variantProducts : []
//   const baseProduct = product.baseProduct
//   const baseProductPrice = baseProduct.price
//   const baseProductImages = baseProduct.images
//   const gallery = product.gallery
//   const relatedProducts =
//     product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct !== 'string') ?? []
// }

// const queryProductBySlug = async ({ slug }: { slug: string }) => {
//   const { isEnabled: draft } = await draftMode()

//   const payload = await getPayload()
//   const authResult = draft ? await payload.auth({ headers: await headers() }) : undefined

//   const user = authResult?.user

//   const result = await payload.find({
//     collection: 'products',
//     depth: 2,
//     draft,
//     limit: 1,
//     overrideAccess: false,
//     user,
//     where: {
//       slug: {
//         equals: slug,
//       },
//     },
//   })

//   return result.docs?.[0] || null
// }
