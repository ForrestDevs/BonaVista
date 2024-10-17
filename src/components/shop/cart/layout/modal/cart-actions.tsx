'use client'

import React from 'react'
import { Button } from '@components/ui/button'
import { useCart } from '@lib/providers/Cart'
import { CartItem } from '@lib/types/cart'
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'

interface CartActionProps {
  item: CartItem
}

export function DecreaseQuantityButton({ item }: CartActionProps) {
  const { addItemToCart, deleteItemFromCart } = useCart()

  const { product, quantity } = item

  if (!product) {
    return null
  }

  if (typeof product === 'string') {
    return null
  }

  if (!quantity) {
    return null
  }

  if (typeof quantity !== 'number') {
    return null
  }

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      addItemToCart({
        product,
        quantity: quantity - 1,
      })
    } else {
      deleteItemFromCart(product.id)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 rounded-full"
      onClick={handleDecreaseQuantity}
    >
      <MinusIcon className="h-3 w-3" />
      <span className="sr-only">Decrease quantity</span>
    </Button>
  )
}

export function IncreaseQuantityButton({ item }: CartActionProps) {
  const { addItemToCart } = useCart()

  const { product, quantity } = item

  if (!product) {
    return null
  }

  if (typeof product === 'string') {
    return null
  }

  if (!quantity) {
    return null
  }

  if (typeof quantity !== 'number') {
    return null
  }

  const handleIncreaseQuantity = () => {
    addItemToCart({
      product,
      quantity: quantity + 1,
    })
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 rounded-full"
      onClick={handleIncreaseQuantity}
    >
      <PlusIcon className="h-3 w-3" />
      <span className="sr-only">Increase quantity</span>
    </Button>
  )
}

export function RemoveItemButton({ item }: CartActionProps) {
  const { deleteItemFromCart, isProductInCart } = useCart()

  const { product } = item

  if (!product) {
    return null
  }

  if (typeof product === 'string') {
    return null
  }

  const productIsInCart = isProductInCart(product)

  if (!productIsInCart) {
    return null
  }

  const handleRemoveItem = () => {
    deleteItemFromCart(product.id)
  }

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRemoveItem}>
      <XIcon className="h-4 w-4" />
      <span className="sr-only">Remove item</span>
    </Button>
  )
}
