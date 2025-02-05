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
import { ProductInfo } from './components/product-info'
import ProductBreadcrumb from './components/product-breadcrumb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
          <ProductBreadcrumb product={product} searchParams={{ from: '' }} />
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
            <div className="lg:row-span-2">
              <ProductGallery />
            </div>
            <div className="lg:max-w-lg">
              <div className="space-y-6">
                {product.brand && (
                  <div className="flex items-center gap-2">
                    {brands.map((brand) => (
                      <Badge key={brand} variant="secondary" className="text-sm">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
                  <p className="mt-3 text-lg text-muted-foreground">{product.description}</p>
                </div>
                <ProductPrice />
                <VariantSelector />
                <AddToCartButton />
                <Separator className="my-8" />
                <ProductInfo />
              </div>
            </div>

            <Separator className="lg:col-span-2" />
            <div className="lg:col-span-2">
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">More Info</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="seller">Seller Info</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-8 lg:col-span-2">
                  {product.moreInfo.root.children.length > 1 ? (
                    <RichText content={product.moreInfo} enableGutter={false} />
                  ) : (
                    <p>No more info available</p>
                  )}
                </TabsContent>
                <TabsContent value="reviews" className="mt-8">
                  <div className="prose prose-sm max-w-none">
                    <p>Reviews coming soon...</p>
                  </div>
                </TabsContent>
                <TabsContent value="seller" className="mt-8">
                  <div className="prose prose-sm max-w-none">
                    <p>Seller information coming soon...</p>
                  </div>
                </TabsContent>
              </Tabs>
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
