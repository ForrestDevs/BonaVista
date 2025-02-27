'use client'

import { useState } from 'react'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { InfoIcon, Loader2Icon, ShoppingCartIcon } from 'lucide-react'
import { Product, ProductVariant } from '@payload-types'
import { Media } from '@components/payload/Media'
import Price from '@components/payload/Price'
import { addToCart } from '@/lib/data/cart'
import { CartItem } from '@/lib/types/cart'
import { useRouter } from 'next/navigation'
import { EnhancedProductVariant } from '@/lib/types/product'

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<EnhancedProductVariant | null>(() => {
    if (product.variants && product.variants.variantProducts.length > 0) {
      const variant = product.variants.variantProducts[0] as EnhancedProductVariant
      return {
        ...variant,
      }
    }
    return null
  })

  const hasVariants =
    product.enableVariants && (product?.variants?.variantProducts?.length ?? 0) > 1

  const price = hasVariants ? selectedVariant?.price : product.baseProduct.price
  const thumbnail = hasVariants
    ? (selectedVariant?.images[0]?.image ?? null)
    : (product?.baseProduct?.images[0]?.image ?? null)

  const handleAddToCart = async (variant: EnhancedProductVariant | null) => {
    setIsAddingToCart(true)

    if (hasVariants) {
      if (variant) {
        console.log('variant', variant)
        const cartItem: CartItem = {
          product: product,
          isVariant: true,
          variantId: parseInt(variant.id),
          variantOptions: variant.info.options.map((o) => ({
            key: o.key,
            value: {
              slug: o.slug,
              label: o.label,
            },
          })),
          quantity: 1,
          price: variant.price,
          url: `/product/${product.slug}`,
          id: variant.id,
        }
        await addToCart(cartItem)
      }
    } else {
      await addToCart({
        product: product,
        isVariant: false,
        quantity: 1,
        price: product.baseProduct.price,
        url: `/product/${product.slug}`,
        id: product.id.toString(),
      })
    }
    setIsAddingToCart(false)
  }

  return (
    <Card className="cursor-pointer group transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <CardHeader
        className="p-0 relative overflow-hidden"
        onClick={() => {
          router.push(`/shop/product/${product.slug}`)
        }}
      >
        <Media
          resource={thumbnail}
          imgClassName="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg w-full aspect-square sm:h-[300px] md:h-[250px] lg:h-[300px]"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <InfoIcon className="h-5 w-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-2">
        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {product.title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Price amount={price} currencyCode="CAD" className="text-lg font-bold text-blue-600" />
        </div>
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 mt-auto">
        {hasVariants ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="col-span-1">
                  {selectedVariant ? selectedVariant.info.options[0].label : 'Select Variant'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="grid gap-4">
                  <h4 className="font-medium leading-none">Select Variant</h4>
                  {product.variants?.variantProducts?.map((variant: EnhancedProductVariant) => (
                    <Button
                      key={variant.id}
                      variant="outline"
                      onClick={() => {
                        setSelectedVariant(variant)
                      }}
                    >
                      {variant.info.options[0].label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              className="col-span-1"
              disabled={!selectedVariant || isAddingToCart}
              onClick={() => handleAddToCart(selectedVariant)}
            >
              {isAddingToCart ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCartIcon className="mr-2 h-4 w-4" />
              )}
              Add to Cart
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => handleAddToCart(null)}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
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