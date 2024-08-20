'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, ProductBaseVariant, ProductVariants } from '@/payload-types'
import { useCart } from '@/lib/providers/Cart'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { ShoppingCartIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductVariant } from '@/lib/types/product'
import { toast } from 'sonner'
import { priceFromJSON } from '@/lib/utils/priceFromJSON'

export function CartActions({ product, className }: { product: Product; className?: string }) {
  const router = useRouter()
  const [isInCart, setIsInCart] = useState<boolean>(false)
  const { addItemToCart, cart, isProductInCart } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setIsInCart(isProductInCart(product, selectedVariant?.id || undefined))
  }, [isProductInCart, product, selectedVariant, cart])

  const handleAddToCart = () => {
    if (product.hasVariants && !selectedVariant) {
      toast.error('Please select a variant')
      return
    }

    if (product.hasVariants && selectedVariant) {
      console.log('Adding variant product to cart', selectedVariant.title)
      addItemToCart({
        product,
        quantity,
        variant: product.hasVariants
          ? selectedVariant!
          : {
              ...product.baseVariant,
              title: product.title, // Add the missing title property
            },
      })
      toast.success('Item added to cart')
    } else if (!product.hasVariants && product.baseVariant) {
      console.log('Adding base variant product to cart')
      addItemToCart({
        product,
        quantity,
      })
      toast.success('Item added to cart')
    }

    router.push('/shop/cart-overlay')
  }

  const getPrice = () => {
    if (product.hasVariants && selectedVariant && selectedVariant.priceJSON) {
      return priceFromJSON(selectedVariant.priceJSON)
    } else if (!product.hasVariants && product.baseVariant?.priceJSON) {
      return priceFromJSON(product.baseVariant.priceJSON)
    }
    return 0
  }

  return (
    <Fragment>
      {product.hasVariants && (
        <div className="mt-6">
          <Select
            onValueChange={(value) => {
              setSelectedVariant(product.variants?.find((v) => v.id === value) || null)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              {product.variants?.map((variant) => (
                <SelectItem key={variant.id} value={variant.id ?? ''}>
                  {variant.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="mt-4 flex items-center gap-4">
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-20"
        />
        <Button className="flex-grow" onClick={handleAddToCart}>
          <ShoppingCartIcon className="mr-2 h-4 w-4" />
          {isInCart ? 'Update cart' : 'Add to cart'}
        </Button>
      </div>
      <div className="mt-2">Price: {getPrice()}</div>
    </Fragment>
  )
}
