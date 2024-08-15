import React from 'react'

import type { Product } from '@/payload-types'
import { useCart } from '@/lib/providers/Cart'
import { Button } from '@/components/ui/button'

export const RemoveFromCartButton: React.FC<{
  className?: string
  product: Product
}> = (props) => {
  const { className, product } = props

  const { deleteItemFromCart, isProductInCart } = useCart()

  const productIsInCart = isProductInCart(product)

  if (!productIsInCart) {
    return <div>Item is not in the cart</div>
  }

  return (
    <Button
      className={className}
      onClick={() => {
        deleteItemFromCart(product)
      }}
    >
      Remove
    </Button>
  )
}
