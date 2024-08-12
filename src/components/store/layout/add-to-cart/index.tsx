'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import type { Product } from '@/payload-types'
import { useCart } from '@/lib/providers/Cart'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

export const AddToCartButton: React.FC<{
  className?: string
  product: Product
  quantity?: number
}> = (props) => {
  const router = useRouter()
  const { className, product, quantity = 1 } = props
  const [isInCart, setIsInCart] = useState<boolean>()
  const { addItemToCart, cart, hasInitializedCart, isProductInCart } = useCart()

  useEffect(() => {
    setIsInCart(isProductInCart(product))
  }, [isProductInCart, product, cart])

  return (
    <Button
      className={cn()}
      onClick={
        !isInCart
          ? () => {
              addItemToCart({
                product,
                quantity,
              })

              router.push('/store/cart-overlay')
            }
          : undefined
      }
      type={!isInCart ? 'button' : undefined}
    >
      {isInCart ? '✓ View in cart' : 'Add to cart'}
    </Button>
  )
}
