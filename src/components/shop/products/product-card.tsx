'use client'

import { useState, useTransition } from 'react'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Badge } from '@components/ui/badge'
import { InfoIcon, Loader2Icon, ShoppingCartIcon, StarIcon } from 'lucide-react'
import { Product } from '@payload-types'
import { Media } from '@components/payload/Media'
import Price from '@components/payload/Price'
import { addToCart } from '@/lib/data/cart'
import { CartItem } from '@/lib/types/cart'
import { useRouter } from 'next/navigation'
import { EnhancedProductVariant } from '@/lib/types/product'
import { cn } from '@/lib/utils/cn'

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [selectedVariant, setSelectedVariant] = useState<EnhancedProductVariant | null>(() => {
    if (product.variants && product.variants.variantProducts.length > 0) {
      return product.variants.variantProducts[0] as EnhancedProductVariant
    }
    return null
  })

  const hasVariants = product.enableVariants && (product.variants?.variantProducts?.length ?? 0) > 0
  const price = hasVariants ? selectedVariant?.price : product.baseProduct.price
  const hasPriceRange = hasVariants && product.priceMin !== product.priceMax
  const thumbnail = hasVariants
    ? (selectedVariant?.images[0]?.image ?? null)
    : (product.baseProduct?.images[0]?.image ?? null)

  const brands = product.brand?.map((brand) => {
    if (typeof brand === 'number') {
      return
    }
    return brand
  })

  const collections = product.collections?.map((collection) => {
    if (typeof collection === 'number') {
      return
    }
    return collection
  })

  const handleAddToCart = () => {
    startTransition(async () => {
      const cartItem: CartItem = {
        lineItem: {
          product: product,
          sku: hasVariants ? selectedVariant.sku : (product.baseProduct?.sku ?? ''),
          quantity: 1,
          price: hasVariants ? selectedVariant.price : (product.baseProduct.price ?? 0),
          url: `${process.env.NEXT_PUBLIC_URL}/shop/product/${product.slug}`,
          isVariant: hasVariants,
          thumbnail: thumbnail,
          variantOptions: hasVariants
            ? selectedVariant.info.options.map((o) => ({
                key: {
                  slug: o.key.slug,
                  label: o.key.label,
                },
                value: {
                  slug: o.slug,
                  label: o.label,
                },
              }))
            : [],
        },
      }
      await addToCart(cartItem)
    })
  }

  const navigateToProduct = () => router.push(`/shop/product/${product.slug}`)

  return (
    <Card className="group h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-200 min-w-[240px]">
      <CardHeader
        className="p-0 relative overflow-hidden cursor-pointer"
        onClick={navigateToProduct}
      >
        <div className="relative w-full h-64 overflow-hidden bg-gray-50">
          <Media
            resource={thumbnail}
            className="w-full h-full"
            imgClassName="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 grow flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {brands?.filter(Boolean).map((brand, index) => (
            <Badge
              key={`brand-${index}`}
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm"
            >
              {brand.name}
            </Badge>
          ))}
          {collections?.filter(Boolean).map((collection, index) => (
            <Badge
              key={`collection-${index}`}
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm"
            >
              {collection.title}
            </Badge>
          ))}
        </div>

        <CardTitle
          onClick={navigateToProduct}
          className="text-base sm:text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 cursor-pointer mt-1"
        >
          {product.title}
        </CardTitle>

        <div className="flex flex-col">
          {hasPriceRange ? (
            <>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                <span>From:</span>
                <Price amount={product.priceMin} currencyCode="CAD" className="font-medium" />
                <span>-</span>
                <Price amount={product.priceMax} currencyCode="CAD" className="font-medium" />
              </div>
              {selectedVariant && (
                <div className="mt-2">
                  <Price
                    amount={selectedVariant.price}
                    currencyCode="CAD"
                    className="text-base sm:text-lg font-bold text-blue-600"
                  />
                </div>
              )}
            </>
          ) : (
            <Price
              amount={price}
              currencyCode="CAD"
              className="text-base sm:text-lg font-bold text-blue-600"
            />
          )}
        </div>

        {product.description && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
            {product.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 border-t border-gray-100">
        {hasVariants ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="col-span-1 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                >
                  {selectedVariant ? selectedVariant.info.options[0].label : 'Select Option'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0 overflow-hidden border border-blue-100">
                <div className="p-3 bg-blue-50 border-b border-blue-100">
                  <h4 className="font-medium text-blue-800">Select Option</h4>
                </div>
                <div className="max-h-[200px] overflow-y-auto p-2">
                  {product.variants?.variantProducts?.map((variant: EnhancedProductVariant) => (
                    <Button
                      key={variant.id}
                      variant="ghost"
                      className={cn(
                        'w-full justify-start text-left mb-1 hover:bg-blue-50',
                        selectedVariant?.id === variant.id && 'bg-blue-50 text-blue-700',
                      )}
                      onClick={() => {
                        setIsOpen(false)
                        setSelectedVariant(variant)
                      }}
                    >
                      {variant.info.options.map((o) => o.label).join(' / ')}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {/* <Select
              onValueChange={(value) =>
                setSelectedVariant(
                  product.variants?.variantProducts.find(
                    (v) => v.id === value,
                  ) as EnhancedProductVariant,
                )
              }
              value={selectedVariant?.sku}
            >
              <SelectTrigger id={'variant-select'}>
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {product.variants?.variantProducts?.map((variant: EnhancedProductVariant) => (
                  <SelectItem key={variant.sku} value={variant.sku}>
                    {variant.info.options.map((o) => o.label).join(' / ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <Button
              className="col-span-1 bg-blue-600 hover:bg-blue-700"
              disabled={!selectedVariant || isPending}
              onClick={handleAddToCart}
            >
              {isPending ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCartIcon className="mr-2 h-4 w-4" />
              )}
              Add
            </Button>
          </div>
        ) : (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            onClick={handleAddToCart}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCartIcon className="mr-2 h-4 w-4" />
            )}
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
