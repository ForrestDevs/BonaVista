'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCartIcon, Loader2Icon } from 'lucide-react'
import { useProduct } from '../context/product-context'
import { addToCart } from '@/lib/data/cart'
import { toast } from 'sonner'
import { QuantitySelector } from './quantity-selector'
import { useState } from 'react'

export function AddToCartButton() {
  const { product, selectedVariant, currentPrice, isVariantSelected, quantity } = useProduct()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (product.enableVariants && !isVariantSelected) {
      toast.error('Please select a variant')
      return
    }

    try {
      setIsLoading(true)
      const cartItem = {
        product: product.id,
        price: currentPrice,
        quantity,
        ...(selectedVariant && {
          isVariant: true,
          variant: {
            id: selectedVariant.id,
            variantOptions: selectedVariant.info.options.map((option) => ({
              key: option.key,
              value: {
                slug: option.slug,
                label: option.label,
              },
            })),
          },
          // variant: [
          //   {
          //     id: selectedVariant.sku,
          //     option:
          //       typeof selectedVariant.info === 'object' && 'options' in selectedVariant.info
          //         ? selectedVariant.info.options[0]?.label
          //         : undefined,
          //   },
          // ],
        }),
      }

      await addToCart(cartItem)
      toast.success('Added to cart')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to add to cart')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <QuantitySelector />
        </div>
        <Button
          className="flex-1"
          size="lg"
          onClick={handleAddToCart}
          disabled={isLoading || (product.enableVariants && !isVariantSelected)}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
              Adding to Cart...
            </>
          ) : (
            <>
              <ShoppingCartIcon className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
      {product.enableVariants && !isVariantSelected && (
        <p className="text-sm text-muted-foreground">Please select a variant to continue</p>
      )}
    </div>
  )
}
